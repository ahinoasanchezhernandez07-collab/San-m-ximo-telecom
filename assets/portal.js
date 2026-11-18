const GENERAL_EMAIL='german@sanmaximotelecom.com';
const storeEmails={
 'concejo':'concejo@sanmaximotelecom.com',
 'zamora':'santaclara@sanmaximotelecom.com',
 'villamayor':'villamayor@sanmaximotelecom.com',
 'carrefour':'carrefour@sanmaximotelecom.com',
 'tormes':'tormes@sanmaximotelecom.com',
 'avila-bulevar':'bulevar@sanmaximotelecom.com',
 'avila-portugal':'avila@sanmaximotelecom.com'
};
const euro=n=>Number(n||0).toLocaleString('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2})+' €';
let cart=[];
function safeText(id){const el=document.getElementById(id);return el?el.value.trim():''}
function sendReviewRequest(event){
 event.preventDefault();const alias=safeText('review-name')||'Cliente',category=safeText('review-category'),rating=safeText('review-rating'),review=safeText('review-text'),consent=document.getElementById('review-consent'),status=document.getElementById('review-status');
 if(!category||!rating||review.length<20||review.length>900||!consent?.checked){if(status)status.textContent='Completa los campos obligatorios y acepta la revisión y publicación.';return}
 const subject='Reseña para revisar · San Máximo Telecom';
 const body='Nueva reseña pendiente de revisión\n\nNombre o alias: '+alias+'\nCategoría: '+category+'\nValoración indicada: '+rating+'/5\n\nReseña:\n'+review+'\n\nLa persona autoriza a revisar y, si se aprueba, publicar el texto con el alias indicado.\n\nRevisar antes de publicar.';
 window.location.href='mailto:german@sanmaximotelecom.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
 if(status)status.textContent='Se ha preparado el correo. Revísalo y pulsa Enviar. El equipo tendrá que aprobar la reseña antes de publicarla.';
}
function toast(message){const node=document.createElement('div');node.className='toast';node.textContent=message;document.body.append(node);setTimeout(()=>node.remove(),3200)}
function loadCart(){try{const value=JSON.parse(localStorage.getItem('sanmaximo-cart')||'[]');cart=Array.isArray(value)?value.filter(x=>x&&typeof x.name==='string'&&Number.isInteger(x.qty)&&x.qty>0):[]}catch(e){cart=[]}renderCart()}
function saveCart(){try{localStorage.setItem('sanmaximo-cart',JSON.stringify(cart))}catch(e){}}
function agregarAlCarrito(name,price=null,type='product',detail=''){const p=(price===null||price===undefined||price===''||!Number.isFinite(Number(price)))?null:Number(price);const found=cart.find(x=>x.name===name&&x.type===type);if(found)found.qty++;else cart.push({name:name,price:p,type:type,detail:detail||'',qty:1});saveCart();renderCart();openCart();toast('Añadido a tu solicitud: '+name)}
function renderCart(){
 const list=document.getElementById('cart-items'),badge=document.getElementById('cart-badge'),totalNode=document.getElementById('cart-total'),monthlyNode=document.getElementById('cart-monthly-total');if(!list)return;
 const count=cart.reduce((n,x)=>n+x.qty,0);if(badge)badge.textContent=count;
 list.textContent='';
 if(!cart.length){const p=document.createElement('p');p.className='text-sm text-slate-500 text-center py-12';p.textContent='Todavía no has añadido nada. Explora tarifas o dispositivos y guárdalos aquí.';list.append(p);if(totalNode)totalNode.textContent='0,00 €';if(monthlyNode)monthlyNode.textContent='0,00 €/mes';updateRequestPreview();return}
 let oneTimeTotal=0,monthlyTotal=0;
 cart.forEach((item,index)=>{
  if(item.price!==null&&item.price!==undefined){if(item.type==='tarifa')monthlyTotal+=item.price*item.qty;else oneTimeTotal+=item.price*item.qty;}
  const card=document.createElement('div');card.className='cart-line';
  const row=document.createElement('div');row.className='flex items-start justify-between gap-3';
  const info=document.createElement('div');info.className='min-w-0';
  const name=document.createElement('p');name.className='text-xs font-extrabold text-slate-900';name.textContent=item.name;
  const price=document.createElement('p');price.className='text-xs font-extrabold text-blue-700 mt-1';price.textContent=item.price===null?'Precio y disponibilidad por confirmar':(item.type==='tarifa'?euro(item.price)+'/mes':euro(item.price)+' unidad');
  const detail=document.createElement('p');detail.className='text-[10px] text-slate-500 mt-1';detail.textContent=item.detail||'';
  info.append(name,price);if(item.detail)info.append(detail);
  const del=document.createElement('button');del.type='button';del.className='text-slate-400 hover:text-rose-600 text-xs';del.setAttribute('aria-label','Eliminar '+item.name);del.innerHTML='<i class="fa-solid fa-trash"></i>';del.addEventListener('click',()=>removeCart(index));
  row.append(info,del);
  const qty=document.createElement('div');qty.className='flex items-center gap-3 mt-3 text-xs';
  const minus=document.createElement('button');minus.type='button';minus.className='w-7 h-7 rounded-lg border border-slate-300 bg-white font-bold';minus.textContent='−';minus.addEventListener('click',()=>changeQty(index,-1));
  const number=document.createElement('span');number.className='font-extrabold';number.textContent=String(item.qty);
  const plus=document.createElement('button');plus.type='button';plus.className='w-7 h-7 rounded-lg border border-slate-300 bg-white font-bold';plus.textContent='+';plus.addEventListener('click',()=>changeQty(index,1));
  qty.append(minus,number,plus);card.append(row,qty);list.append(card);
 });
 if(totalNode)totalNode.textContent=euro(oneTimeTotal);
 if(monthlyNode)monthlyNode.textContent=euro(monthlyTotal)+'/mes';
 updateRequestPreview();
}
function changeQty(i,delta){if(!cart[i])return;cart[i].qty+=delta;if(cart[i].qty<=0)cart.splice(i,1);saveCart();renderCart()}
function removeCart(i){cart.splice(i,1);saveCart();renderCart();toast('Artículo eliminado')}
function openCart(){const el=document.getElementById('cart-overlay');if(el)el.classList.add('open')}
function closeCart(){const el=document.getElementById('cart-overlay');if(el)el.classList.remove('open')}
function toggleCarrito(){const el=document.getElementById('cart-overlay');if(el)el.classList.toggle('open')}
function proceedToContact(){if(!cart.length){toast('Añade primero una tarifa o producto');return}window.location.href='contacto.html?origen=carrito'}
function proceedToCheckout(){if(!cart.some(x=>x.type==='producto')){toast('Añade un dispositivo o accesorio para probar la compra');return}window.location.href='compra-demo.html'}
function updateRequestPreview(){
 const el=document.getElementById('request-items-preview');if(!el)return;el.textContent='';
 if(!cart.length){el.textContent='No hay artículos guardados en tu solicitud.';return}
 cart.forEach(item=>{const p=document.createElement('p');p.className='text-xs py-2 border-b border-slate-200';p.textContent=item.qty+' × '+item.name+' — '+(item.price===null?'Precio por confirmar':euro(item.price)+(item.type==='tarifa'?'/mes':''))+(item.detail?' · '+item.detail:'');el.append(p)});
 const monthly=cart.reduce((sum,item)=>sum+(item.type==='tarifa'&&item.price!==null?item.price*item.qty:0),0);
 const oneTime=cart.reduce((sum,item)=>sum+(item.type!=='tarifa'&&item.price!==null?item.price*item.qty:0),0);
 const sum=document.getElementById('request-monthly-total');if(sum)sum.textContent=euro(oneTime)+' en productos · '+euro(monthly)+'/mes en tarifas';
}
function sendRequestEmail(event){
 event.preventDefault();const name=safeText('request-name'),email=safeText('request-email'),message=safeText('request-message'),dest=safeText('request-destination')||GENERAL_EMAIL;
 if(!name||!email||!message){toast('Completa nombre, correo y consulta');return}
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){toast('Revisa el correo electrónico');return}
 const lines=cart.length?cart.map(x=>'- '+x.qty+' × '+x.name+' | '+(x.price===null?'Precio por confirmar':euro(x.price)+(x.type==='tarifa'?'/mes':''))+' | '+(x.detail||'')).join('\n'):'No hay productos añadidos al carrito.';
 const monthlyTotal=cart.reduce((sum,x)=>sum+(x.type==='tarifa'&&x.price!==null?x.price*x.qty:0),0);
 const oneTimeTotal=cart.reduce((sum,x)=>sum+(x.type!=='tarifa'&&x.price!==null?x.price*x.qty:0),0);
 const subject='Solicitud desde la web de San Máximo Telecom';
 const body='Hola, me gustaría recibir información.\n\nNombre: '+name+'\nCorreo para responderme: '+email+'\n\nConsulta:\n'+message+'\n\nMi selección:\n'+lines+'\n\nSubtotal de dispositivos y productos: '+euro(oneTimeTotal)+'.\nCuota mensual estimada de tarifas: '+euro(monthlyTotal)+'/mes.\n\nEntiendo que esta solicitud no es una contratación ni un pago. Quedo pendiente de confirmar disponibilidad y condiciones.';
 const safeDest=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dest)?dest:GENERAL_EMAIL;const url='mailto:'+safeDest+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
 window.location.href=url;
 const status=document.getElementById('request-status');if(status)status.textContent='Se ha preparado un correo en tu aplicación de email. Revísalo y pulsa Enviar para transmitir la solicitud.';
}
function openMobileMenu(){const el=document.getElementById('mobile-nav');if(el)el.classList.toggle('open')}
function toggleTheme(){document.body.classList.toggle('dark-mode');try{localStorage.setItem('sanmaximo-theme',document.body.classList.contains('dark-mode')?'dark':'light')}catch(e){}updateThemeButton()}
function updateThemeButton(){const dark=document.body.classList.contains('dark-mode'),icon=document.getElementById('theme-icon'),btn=document.getElementById('theme-toggle');if(icon)icon.className='fa-solid '+(dark?'fa-sun':'fa-moon');if(btn)btn.setAttribute('aria-label',dark?'Activar modo claro':'Activar modo oscuro')}
function addMessage(text,role,link,choices){
 const box=document.getElementById('chat-messages');if(!box)return;
 const b=document.createElement('div');b.className='chat-bubble '+(role==='user'?'user':'bot');b.textContent=text;
 if(link){const a=document.createElement('a');a.href=link[0];a.className='block mt-2 font-extrabold text-blue-700 underline';a.textContent=link[1];b.append(a)}
 if(Array.isArray(choices)&&choices.length){const row=document.createElement('div');row.className='maxi-choice-row';choices.forEach(label=>{const button=document.createElement('button');button.type='button';button.className='maxi-choice';button.textContent=label;button.addEventListener('click',()=>presetMaxi(label));row.append(button)});b.append(row)}
 box.append(b);box.scrollTop=box.scrollHeight;
}
function toggleMaxi(){const panel=document.getElementById('maxi-chat');if(!panel)return;const opening=panel.classList.contains('hidden');panel.classList.toggle('hidden');if(opening){const input=document.getElementById('maxi-input');if(input)input.focus()}}
function presetMaxi(text){const input=document.getElementById('maxi-input');if(input)input.value=text;sendMaxi()}
let maxiFlow=null;
function answerMaxi(raw){
 const q=raw.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 const has=(...words)=>words.some(x=>q.includes(x));
 if(maxiFlow==='device-priority'){maxiFlow=null;
  if(has('camara','foto','fotografia'))return ['Para fotografía, compara cámara, estabilizador y calidad nocturna. Puedes revisar modelos y características en la tienda.',['dispositivos.html','Ver móviles'],['Comparar iPhone y Samsung','Ver todos los móviles']];
  if(has('bateria','autonomia','duracion'))return ['Para tener más autonomía, fíjate en la batería, la potencia de carga y las pruebas de uso.',['dispositivos.html','Ver dispositivos']];
  if(has('precio','economico','barato','ahorrar'))return ['Para priorizar precio, compara primero los modelos más económicos y confirma las ofertas vigentes.',['dispositivos.html','Ver catálogo'],['Ver tarifas de móvil']];
  if(has('juego','gaming','potencia'))return ['Para jugar, compara procesador, pantalla, memoria y temperatura, no solo la cámara.',['dispositivos.html','Ver móviles']];
  return ['Podemos comparar cámara, batería, potencia y precio. ¿Qué modelos quieres revisar?',['dispositivos.html','Abrir catálogo']];
 }
 if(has('opinion','opiniones','reseña','resena','valorar','valoracion','experiencia'))return ['En Opiniones puedes leer testimonios publicados por la empresa y enviar tu reseña para que el equipo la revise.',['opiniones.html','Ver opiniones y escribir reseña']];
 if(has('recomiend','ayudame a elegir','ayudarme a elegir','no se cual','no se que movil','que movil me compro','cual me conviene')){maxiFlow='device-priority';return ['¡Claro! Te ayudo a elegir. ¿Qué es lo más importante para ti?',['dispositivos.html','Ver catálogo'],['Cámara','Batería','Precio','Juegos']]}
 if(has('carrito','cesta','solicitud','mi compra')){openCart();return ['He abierto tu cesta. Puedes cambiar cantidades, quitar productos o continuar al resumen.',''];}
 if(has('finalizar compra','hacer pedido','terminar compra'))return ['Te llevo al resumen de tu cesta para revisar los artículos y el importe.',['compra-demo.html','Finalizar compra']];
 if(has('movil','smartphone','tablet','auricular','reloj','accesorio','iphone','samsung','bateria externa','power bank'))return ['En Dispositivos puedes filtrar productos, elegir una variante, consultar fotografías y vídeos y añadirlos a tu cesta.',['dispositivos.html','Ver dispositivos'],['Ayúdame a elegir un móvil','Ver opiniones']];
 if(has('precio','tarifa','fibra','datos','gb','permanencia','cobertura'))return ['En Tarifas puedes comparar cuotas y promociones. La cobertura debe comprobarse para la dirección donde se instalará el servicio.',['tarifas.html','Comparar tarifas'],['Hablar con el equipo']];
 if(has('factura','recibo','ahorro','analizar'))return ['En Facturas puedes leer un PDF o imagen en tu navegador y comparar el importe con otra oferta. Revisa siempre la cifra detectada.',['facturas.html','Analizar factura'],['Contactar con un asesor']];
 if(has('luz','gas','energia','kwh','electricidad'))return ['En Energía puedes calcular el coste a partir de tus kWh y comparar dos ofertas.',['energia.html','Comparar energía']];
 if(has('tienda','direccion','ubicacion','mapa','donde'))return ['En Tiendas encontrarás el mapa, las direcciones y el correo de cada establecimiento.',['tiendas.html','Ver tiendas']];
 if(has('persona','asesor','contactar','contacto','correo','email','hablar con alguien','reclamacion','queja','incidencia','averia'))return ['Te llevo a Contacto para que elijas el equipo o la tienda y expliques qué necesitas.',['contacto.html','Contactar con el equipo']];
 if(has('garantia','devolucion','devolver','envio','stock','disponibilidad','financiacion','financiar'))return ['Las condiciones de garantía, devolución, envío, financiación y stock deben confirmarse para el producto concreto. Puedes pedir la información por escrito.',['contacto.html','Consultar condiciones']];
 if(has('cita','visita','reservar'))return ['Puedes preparar un recordatorio de visita desde Contacto. La tienda tendrá que confirmar la hora.',['contacto.html#cita','Preparar visita']];
 if(has('hola','buenas','buenos dias','buenas tardes'))return ['¡Hola! Soy Maxi. Puedo ayudarte a elegir un dispositivo, comparar tarifas, revisar una factura, encontrar una tienda o escribir una reseña. ¿Qué necesitas?','',['Elegir un móvil','Comparar tarifas','Analizar factura','Ver opiniones','Contactar']];
 if(has('gracias','perfecto'))return ['¡De nada! ¿Necesitas que te lleve a algún apartado?','',['Ver tarifas','Dispositivos','Opiniones','Contactar']];
 return ['Puedo guiarte paso a paso con tarifas, móviles, facturas, energía, tiendas, reseñas o tu cesta. ¿Por dónde empezamos?',['contacto.html','Contactar con el equipo'],['Elegir un móvil','Comparar tarifas','Ver opiniones','Abrir mi cesta']];
}
function sendMaxi(){
 const input=document.getElementById('maxi-input');if(!input)return;
 const value=input.value.trim();if(!value)return;input.value='';addMessage(value,'user');
 const result=answerMaxi(value);addMessage(result[0],'bot',Array.isArray(result[1])?result[1]:null,Array.isArray(result[2])?result[2]:null);
}
function filterDevices(){const q=(safeText('device-search')||'').toLocaleLowerCase('es'),category=safeText('device-filter')||'all';let count=0;document.querySelectorAll('.device-card').forEach(card=>{const okCat=category==='all'||card.dataset.category===category;const okText=!q||(card.dataset.keywords+' '+card.innerText).toLocaleLowerCase('es').includes(q);card.style.display=okCat&&okText?'block':'none';if(okCat&&okText)count++});const empty=document.getElementById('device-empty');if(empty)empty.classList.toggle('hidden',count!==0)}
function updateStoreMap(){const select=document.getElementById('store-map-select');if(!select)return;const address=select.value,encoded=encodeURIComponent(address);const frame=document.getElementById('store-map-frame'),link=document.getElementById('store-map-link');if(frame)frame.src='https://maps.google.com/maps?q='+encoded+'&output=embed';if(link)link.href='https://www.google.com/maps/search/?api=1&query='+encoded}
function makeCalendarReminder(){const d=safeText('visit-date'),t=safeText('visit-time');if(!d||!t){toast('Elige fecha y hora');return}const start=new Date(d+'T'+t+':00');if(Number.isNaN(start.getTime())||start<new Date()){toast('Elige una fecha y hora futuras');return}const end=new Date(start.getTime()+30*60000),stamp=x=>x.getFullYear()+String(x.getMonth()+1).padStart(2,'0')+String(x.getDate()).padStart(2,'0')+'T'+String(x.getHours()).padStart(2,'0')+String(x.getMinutes()).padStart(2,'0')+'00';const store=safeText('visit-store'),reason=safeText('visit-reason');const content=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//San Maximo Telecom//Recordatorio//ES','BEGIN:VEVENT','UID:'+Date.now()+'@sanmaximo.local','DTSTAMP:'+stamp(new Date()),'DTSTART:'+stamp(start),'DTEND:'+stamp(end),'SUMMARY:Recordatorio de visita San Máximo Telecom','LOCATION:'+store.replace(/,/g,'\\,'),'DESCRIPTION:Recordatorio personal. La tienda debe confirmar la hora. Motivo: '+reason,'END:VEVENT','END:VCALENDAR'].join('\r\n');const blob=new Blob([content],{type:'text/calendar;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='recordatorio-san-maximo.ics';a.click();URL.revokeObjectURL(url);const status=document.getElementById('visit-status');if(status)status.textContent='Recordatorio descargado. La visita no está reservada: contacta con la tienda para confirmar.'}

const GLOBAL_SEARCH_ITEMS=[
 {title:'Tarifas de fibra y móvil',description:'Precios y condiciones de los servicios.',url:'tarifas.html',terms:'tarifas tarifa fibra móvil movil datos gb precio'},
 {title:'Presupuesto para el hogar',description:'Calcula una propuesta según personas y líneas.',url:'tarifas.html#configurador-hogar',terms:'familia personas casa presupuesto factura líneas lineas hogar'},
 {title:'Comparador de ofertas',description:'Compara promociones y coste de dos ofertas.',url:'tarifas.html',terms:'comparar ofertas promoción cuota coste ahorro'},
 {title:'Móviles y accesorios',description:'Encuentra smartphones, auriculares y complementos.',url:'dispositivos.html',terms:'móviles moviles móvil movil smartphone iphone samsung auriculares accesorios'},
 {title:'Analizar una factura',description:'Revisa un PDF o una imagen.',url:'facturas.html',terms:'factura facturas recibo pdf analizar'},
 {title:'Luz y gas',description:'Calcula y compara ofertas de energía.',url:'energia.html',terms:'luz gas energía energia electricidad kwh'},
 {title:'Tiendas y direcciones',description:'Mapa y datos de los establecimientos.',url:'tiendas.html',terms:'tienda tiendas dirección direccion mapa salamanca zamora ávila avila'},
 {title:'Contacto y teléfono',description:'Llama al 923 24 43 69 o escribe al equipo.',url:'contacto.html',terms:'contacto llamar teléfono telefono número numero asesor persona'},
 {title:'Opiniones y reseñas',description:'Lee testimonios y comparte tu experiencia.',url:'opiniones.html',terms:'opiniones reseñas reseña valoración valoracion estrellas'},
 {title:'Servicios para empresas',description:'Soluciones de conectividad para negocios.',url:'servicios.html#empresas',terms:'empresa empresas negocio autónomos autonomos'},
 {title:'Mi área de cliente',description:'Información y accesos para tus gestiones.',url:'clientes.html',terms:'cliente clientes área area gestiones soporte'}
];
function normaliseSearch(value){return String(value||'').toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function renderGlobalSearch(query){
 const box=document.getElementById('global-search-results');if(!box)return;box.textContent='';
 const tokens=normaliseSearch(query).trim().split(/\s+/).filter(Boolean);
 const results=GLOBAL_SEARCH_ITEMS.filter(item=>!tokens.length||tokens.every(token=>normaliseSearch(item.title+' '+item.description+' '+item.terms).includes(token))).slice(0,7);
 if(!results.length){const empty=document.createElement('p');empty.className='global-search-empty';empty.textContent='No hemos encontrado ese apartado. Puedes contactar con el equipo.';const link=document.createElement('a');link.href='contacto.html';link.textContent='Ir a Contacto';link.className='global-search-result-link';box.append(empty,link);return}
 results.forEach(item=>{const a=document.createElement('a');a.href=item.url;a.className='global-search-result';const icon=document.createElement('span');icon.className='global-search-result-icon';icon.innerHTML='<i class="fa-solid fa-arrow-right"></i>';const text=document.createElement('span');text.className='global-search-result-text';const title=document.createElement('b');title.textContent=item.title;const desc=document.createElement('small');desc.textContent=item.description;text.append(title,desc);a.append(icon,text);box.append(a)});
}
function initGlobalSearch(){
 const header=document.querySelector('header.site-header'),controls=header?.querySelector('.flex.items-center.gap-2.shrink-0');if(!header||!controls||document.getElementById('global-search-toggle'))return;
 const toggle=document.createElement('button');toggle.type='button';toggle.id='global-search-toggle';toggle.className='header-icon';toggle.title='Buscar en toda la web';toggle.setAttribute('aria-label','Buscar en toda la web');toggle.innerHTML='<i class="fa-solid fa-magnifying-glass"></i>';controls.insertBefore(toggle,controls.firstChild);
 const panel=document.createElement('div');panel.id='global-search-panel';panel.className='global-search-panel hidden';panel.innerHTML='<div class="global-search-inner"><div class="global-search-field"><i class="fa-solid fa-magnifying-glass"></i><input id="global-search-input" type="search" placeholder="Busca tarifas, móviles, facturas, tiendas…" autocomplete="off" aria-label="Buscar en toda la web"><button id="global-search-close" type="button" aria-label="Cerrar búsqueda"><i class="fa-solid fa-xmark"></i></button></div><div class="global-search-hint">Acceso rápido a todos los apartados</div><div id="global-search-results" class="global-search-results" aria-live="polite"></div></div>';
 header.insertAdjacentElement('afterend',panel);
 const input=panel.querySelector('#global-search-input');
 const open=()=>{panel.classList.remove('hidden');renderGlobalSearch(input.value);input.focus()};
 const close=()=>{panel.classList.add('hidden');toggle.focus()};
 toggle.addEventListener('click',()=>panel.classList.contains('hidden')?open():close());
 panel.querySelector('#global-search-close').addEventListener('click',close);
 input.addEventListener('input',()=>renderGlobalSearch(input.value));
 input.addEventListener('keydown',event=>{if(event.key==='Escape')close();if(event.key==='Enter'){const first=panel.querySelector('.global-search-result');if(first)location.href=first.href}});
 document.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();open()}if(event.key==='Escape'&&!panel.classList.contains('hidden'))close()});
 document.addEventListener('click',event=>{if(!panel.contains(event.target)&&!toggle.contains(event.target)&&!panel.classList.contains('hidden'))panel.classList.add('hidden')});
}
function calculateHouseholdQuote(){
 const people=Number(safeText('quote-people')||2),lines=Number(safeText('quote-lines')||0),fibre=safeText('quote-fibre')==='yes',usage=safeText('quote-use')||'normal';
 let title='Necesitamos revisar tu combinación',description='No hay un precio público confirmado para esta combinación.',promo=0,months=0,normal=0,year=0,detail='',advice='El equipo debe confirmar la tarifa y las condiciones antes de darte un precio.',valid=false;
 if(fibre&&lines===0){valid=true;title='Fibra 600 Mb';description='Internet en casa sin líneas móviles incluidas.';promo=19.90;months=12;normal=29.90;detail='Fibra 600 Mb';advice='19,90 €/mes durante 12 meses y después 29,90 €/mes. La instalación es gratuita con al menos 3 meses de permanencia; consulta las condiciones de baja y devolución del router.'}
 else if(fibre&&lines===2){valid=true;title='Fibra 600 Mb + 2 líneas';description='Fibra, fijo y dos líneas móviles con 50 GB compartidos.';promo=49;months=3;normal=55;detail='Fibra 600 Mb + fijo + 2 líneas con 50 GB compartidos';advice='49 €/mes durante 3 meses y después 55 €/mes. Paquete público de Yoigo sujeto a cobertura y condiciones.'}
 else if(!fibre&&lines===1){valid=true;title='Móvil 35 GB';description='Una línea móvil con 35 GB y llamadas ilimitadas.';promo=14;months=0;normal=14;detail='1 línea móvil con 35 GB y llamadas ilimitadas';advice='14 €/mes, según la tarifa pública de Yoigo.'}
 else if(fibre&&lines===1){advice='La oferta pública consultada no confirma un paquete de fibra con una sola línea. Solicita un estudio personalizado.'}
 else if(fibre&&lines>2){advice='El precio de líneas adicionales depende de la oferta y no se ha añadido una cuota estimada. Solicita un estudio personalizado.'}
 else if(!fibre&&lines>1){advice='No se ha confirmado un precio individual para varias líneas sin fibra. Solicita un estudio personalizado.'}
 if(valid)year=months?promo*months+normal*(12-months):normal*12;
 if(usage==='intensive')advice+=' Para streaming y teletrabajo, revisa la cobertura disponible en casa.';
 if(usage==='gaming')advice+=' Para juegos y muchos dispositivos, confirma la cobertura y el rendimiento de la fibra.';
 const fmt=n=>Number(n).toLocaleString('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2})+' €';
 const set=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value};
 set('quote-title',title);set('quote-description',people+' persona(s) en el hogar · '+lines+' línea(s) móvil(es) · '+(fibre?'con fibra 600 Mb':'sin fibra')+'. '+description);
 set('quote-promo',valid?fmt(promo)+'/mes':'A consultar');set('quote-normal',valid?fmt(normal)+'/mes':'A consultar');
 set('quote-promo-period',valid?(months?'Durante '+months+' meses':'Sin promoción temporal indicada'):'No disponible para esta combinación');
 set('quote-normal-period',valid?(months?'Después de la promoción':'Cuota mensual'):'Contacta con el equipo');
 set('quote-year',valid?fmt(year):'A consultar');set('quote-advice',advice+' Precios públicos de referencia con IVA incluido; sujetos a confirmación.');
 const add=document.getElementById('quote-add'),print=document.getElementById('quote-print');if(add)add.disabled=!valid;if(print)print.disabled=!valid;
 window.householdQuote={people,lines,fibre,usage,title,description,promo,months,normal,year,detail,advice,valid};
 return window.householdQuote;
}
function printHouseholdQuote(){
 const q=calculateHouseholdQuote();if(!q.valid){toast('Esta combinación necesita confirmación del equipo');return}
 const fmt=n=>Number(n).toLocaleString('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2})+' €';
 const popup=window.open('','_blank','width=820,height=720');if(!popup){toast('Permite las ventanas emergentes para guardar el presupuesto');return}
 const html='<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Presupuesto orientativo · San Máximo Telecom</title><style>body{font-family:Arial,sans-serif;color:#172b48;margin:40px;line-height:1.5}header{border-bottom:3px solid #2563eb;padding-bottom:18px}.brand{font-weight:900;color:#1d4ed8}h1{font-size:26px}table{width:100%;border-collapse:collapse;margin:25px 0}td,th{text-align:left;padding:12px;border-bottom:1px solid #dce5f0}.summary{background:#eff6ff;border-radius:12px;padding:18px}.summary b{font-size:22px;color:#1d4ed8}.foot{margin-top:30px;border-top:1px solid #dce5f0;padding-top:15px;font-size:11px;color:#596b80}@media print{body{margin:18mm}}</style></head><body><header><div class="brand">SAN MÁXIMO TELECOM</div><h1>Presupuesto orientativo para el hogar</h1><small>Fecha: '+new Date().toLocaleDateString('es-ES')+'</small></header><p><b>Personas:</b> '+q.people+' · <b>Líneas:</b> '+q.lines+' · <b>Fibra:</b> '+(q.fibre?'Sí, 600 Mb':'No')+'</p><table><tr><th>Propuesta</th><th>Detalle</th><th>Cuota inicial</th></tr><tr><td>'+q.title+'</td><td>'+q.detail+'</td><td>'+fmt(q.promo)+'/mes</td></tr></table><div class="summary"><p><b>Cuota inicial:</b> '+fmt(q.promo)+'/mes'+(q.months?' durante '+q.months+' meses':'')+'</p><p><b>Después:</b> '+fmt(q.normal)+'/mes</p><p><b>Coste estimado del primer año:</b> '+fmt(q.year)+'</p></div><p>'+q.advice+'</p><div class="foot">Documento informativo basado en los precios de referencia publicados en esta web, con IVA incluido. No es una factura fiscal, contrato ni oferta vinculante. Cobertura, disponibilidad, compatibilidad y condiciones deben confirmarse con San Máximo Telecom. Teléfono de contacto: 923 24 43 69.</div><script>window.onload=()=>window.print();</script></body></html>';
 popup.document.open();popup.document.write(html);popup.document.close();
}
function initHouseholdQuote(){
 const people=document.getElementById('quote-people'),lines=document.getElementById('quote-lines'),fibre=document.getElementById('quote-fibre'),usage=document.getElementById('quote-use');
 if(!people||!lines||!fibre||!usage)return;
 people.addEventListener('change',calculateHouseholdQuote);
 [lines,fibre,usage].forEach(el=>el.addEventListener('change',calculateHouseholdQuote));
 document.getElementById('quote-calculate')?.addEventListener('click',calculateHouseholdQuote);
 document.getElementById('quote-print')?.addEventListener('click',printHouseholdQuote);
 document.getElementById('quote-add')?.addEventListener('click',()=>{const q=calculateHouseholdQuote();if(!q.valid){toast('Esta combinación necesita confirmación del equipo');return}agregarAlCarrito(q.title,q.promo,'tarifa',q.detail+' · después '+q.normal.toFixed(2).replace('.',',')+' €/mes · presupuesto orientativo para '+q.people+' persona(s)')});
 calculateHouseholdQuote();
}

function initPortal(){
 try{if(localStorage.getItem('sanmaximo-theme')==='dark')document.body.classList.add('dark-mode')}catch(e){}
 updateThemeButton();loadCart();initHomeMotion();initGlobalAuth();initGlobalSearch();initHouseholdQuote();renderDeviceStore();
 const date=document.getElementById('visit-date');if(date){const now=new Date();now.setMinutes(now.getMinutes()-now.getTimezoneOffset());date.min=now.toISOString().slice(0,10)}
 const search=document.getElementById('device-search');if(search)search.addEventListener('input',filterDevices);
 const filter=document.getElementById('device-filter');if(filter)filter.addEventListener('change',filterDevices);
 const store=document.getElementById('store-map-select');if(store)store.addEventListener('change',updateStoreMap);
 const form=document.getElementById('request-form');if(form)form.addEventListener('submit',sendRequestEmail);
 const input=document.getElementById('maxi-input');if(input)input.addEventListener('keydown',e=>{if(e.key==='Enter')sendMaxi()});
 const mobile=document.getElementById('menu-toggle');if(mobile)mobile.addEventListener('click',openMobileMenu);
 const theme=document.getElementById('theme-toggle');if(theme)theme.addEventListener('click',toggleTheme);
 const cartButton=document.getElementById('cart-open');if(cartButton)cartButton.addEventListener('click',toggleCarrito);
 const close=document.getElementById('cart-close');if(close)close.addEventListener('click',closeCart);
 const continueButton=document.getElementById('cart-continue');if(continueButton)continueButton.addEventListener('click',proceedToContact);
 const buyDemoButton=document.getElementById('cart-buy-demo');if(buyDemoButton)buyDemoButton.addEventListener('click',proceedToCheckout);
 const demoConfirm=document.getElementById('demo-confirm');if(demoConfirm){demoConfirm.addEventListener('click',confirmDemoPurchase);updateDemoCheckout();initDemoPaymentUI()}
 const demoDownload=document.getElementById('demo-download-receipt');if(demoDownload)demoDownload.addEventListener('click',downloadDemoReceipt);
 const maxi=document.getElementById('maxi-launcher');if(maxi)maxi.addEventListener('click',toggleMaxi);
 const closeMaxi=document.getElementById('maxi-close');if(closeMaxi)closeMaxi.addEventListener('click',toggleMaxi);
 document.querySelectorAll('[data-maxi]').forEach(b=>b.addEventListener('click',()=>presetMaxi(b.dataset.maxi)));
 const reviewForm=document.getElementById('review-form');if(reviewForm)reviewForm.addEventListener('submit',sendReviewRequest);
 const reviewText=document.getElementById('review-text'),reviewCount=document.getElementById('review-count');if(reviewText&&reviewCount){const updateReviewCount=()=>{reviewCount.textContent=reviewText.value.length+'/900'};reviewText.addEventListener('input',updateReviewCount);updateReviewCount();}
 const params=new URLSearchParams(location.search),requestMessage=document.getElementById('request-message');if(requestMessage&&!requestMessage.value.trim()){const type=params.get('tipo');if(params.get('origen')==='carrito')requestMessage.value='Me gustaría recibir información sobre los productos y tarifas que he añadido a mi solicitud. Por favor, confirmad disponibilidad, cobertura y condiciones.';else if(type==='empresa')requestMessage.value='Me gustaría solicitar información sobre soluciones de conectividad y telecomunicaciones para mi empresa.';else if(type==='energia')requestMessage.value='Me gustaría recibir asesoramiento sobre una oferta de luz o gas.';else if(type==='factura')requestMessage.value='Me gustaría recibir ayuda para revisar mi factura y comparar alternativas.'}
}
document.addEventListener('DOMContentLoaded',initPortal);

const DEVICE_PRODUCTS=[
 {id:"iphone17",name:"Apple iPhone 17",variant:"256 GB",price:1109,category:"moviles",categoryLabel:"Smartphone",badge:"Precio Apple España",image:"https://youget.pt/245640-large_default/apple-iphone-17-63-256gb-verde-salvia.jpg",gallery:["https://youget.pt/245640-large_default/apple-iphone-17-63-256gb-verde-salvia.jpg","https://www.apple.com/la/iphone-17/images/meta/iphone-17_specs__bzlgip6v14mu_og.png"],alt:"Apple iPhone 17, vistas frontal y trasera",description:"Pantalla Super Retina XDR de 6,3 pulgadas con ProMotion, chip A19 y cámara dual Fusion de 48 Mpx.",specs:["256 GB de almacenamiento","Pantalla OLED de 6,3 pulgadas","Chip A19"],source:"Apple España",sourceUrl:"https://www.apple.com/es/iphone-17/",video:"H3KnMyojEQU",start:1783,videoLabel:"Apple · presentación iPhone 17",variants:["Negro","Azul neblina","Lavanda","Blanco","Verde salvia"],imageCredit:"YouGet · foto de producto / Apple · ficha oficial"},
 {id:"galaxys26",name:"Samsung Galaxy S26 Ultra",variant:"512 GB · 12 GB RAM",price:1499,category:"moviles",categoryLabel:"Smartphone",badge:"Precio de referencia",image:"https://img.uswitch.com/s3/uswitch-assets-eu/mobiles-core/production/handset-variant/samsung-galaxy-s26-ultra/cobalt-violet-combo-1771952942993.png",gallery:["https://img.uswitch.com/s3/uswitch-assets-eu/mobiles-core/production/handset-variant/samsung-galaxy-s26-ultra/cobalt-violet-combo-1771952942993.png","https://kream-phinf.pstatic.net/MjAyNjAzMDNfMTY4/MDAxNzcyNTIzODY4MDc3.LCCwwRXEfRoVukFE59fo3XvRfCwDSFivby_lDFhvLe0g.xK8oOfKTVSs8NYPngaaqu-ep7Y2Kyo2t7dr7fTuXsxQg.PNG/a_f84678245a624674bd7dec45eccf8211.png"],alt:"Samsung Galaxy S26 Ultra, frontal, trasera y S Pen",description:"Pantalla Dynamic AMOLED 2X de 6,9 pulgadas, cámara principal de 200 Mpx, S Pen integrado y funciones Galaxy AI.",specs:["512 GB de almacenamiento","12 GB de RAM","Pantalla de 6,9 pulgadas"],source:"Samsung España",sourceUrl:"https://www.samsung.com/es/smartphones/galaxy-s26-ultra/",video:"ivqUkizvA6s",videoLabel:"Samsung · demostración oficial de Galaxy S26 Ultra",variants:["Negro","Azul cielo","Violeta","Blanco"],imageCredit:"Uswitch / KREAM · fotos de producto"},
 {id:"buds4pro",name:"Samsung Galaxy Buds4 Pro",variant:"Auriculares inalámbricos",price:199,category:"audio",categoryLabel:"Audio",badge:"Precio de referencia",image:"https://images.samsung.com/de/galaxy-buds4/buy/03_Gallery/01_Global_Color_Group_KV/Handel/Global_Color_Group_KV_PC.png",gallery:["https://images.samsung.com/de/galaxy-buds4/buy/03_Gallery/01_Global_Color_Group_KV/Handel/Global_Color_Group_KV_PC.png","https://i5.walmartimages.ca/asr/00d48070-1746-4561-b5c5-51b1c9109c17.0f466b1edeacdcdb50346563e196b048.jpeg?odnBg=FFFFFF&odnHeight=2000&odnWidth=2000"],alt:"Samsung Galaxy Buds4 Pro con estuche, colores blanco y negro",description:"Auriculares inalámbricos con audio Hi-Fi, cancelación activa de ruido y estuche de carga.",specs:["Audio Hi-Fi de alta resolución","Cancelación activa de ruido","Estuche de carga"],source:"Samsung España",sourceUrl:"https://www.samsung.com/es/audio-sound/galaxy-buds4-pro/buy/",video:null,videoPage:true,videoLabel:"Vídeos y ficha en Samsung",variants:["Blanco","Negro"],imageCredit:"Samsung / LDLC · fotos de producto"},
 {id:"jbl770",name:"JBL Tune 770NC",variant:"Auriculares de diadema",price:94.99,category:"audio",categoryLabel:"Audio",badge:"PVP JBL España",image:"https://www.jbl.es/dw/image/v2/BFND_PRD/on/demandware.static/-/Sites-masterCatalog_Harman/default/dwdcaaf7a3/JBL_TUNE_770NC_FOLD_REGULAR_BLACK_41791_x1.png?sh=680&sw=680",gallery:["https://www.jbl.es/dw/image/v2/BFND_PRD/on/demandware.static/-/Sites-masterCatalog_Harman/default/dwdcaaf7a3/JBL_TUNE_770NC_FOLD_REGULAR_BLACK_41791_x1.png?sh=680&sw=680","https://www.pbtech.co.nz/imgprod/H/S/HSTJBL5692357__6.jpg?h=4171540170"],alt:"Auriculares JBL Tune 770NC negros",description:"Auriculares circumaurales con cancelación de ruido adaptativa, sonido JBL Pure Bass y hasta 70 horas de batería según JBL.",specs:["Bluetooth 5.3","Cancelación de ruido adaptativa","Hasta 70 horas de batería"],source:"JBL España",sourceUrl:"https://www.jbl.es/TUNE770NC.html",video:null,videoPage:true,videoLabel:"Vídeo de producto en JBL",variants:["Negro"],imageCredit:"JBL · imagen oficial / Ayoub Computers · foto adicional"},
 {id:"xiaomipower",name:"Xiaomi Power Bank 10000 mAh 22,5 W Lite",variant:"Gris · 10.000 mAh",price:14.60,category:"carga",categoryLabel:"Accesorio",badge:"Precio de referencia",image:"https://www.ktronix.com/medias/6941812758663-001-750Wx750H?context=bWFzdGVyfGltYWdlc3wyMzg2fGltYWdlL3dlYnB8YURFeUwyaG1NeTh4TlRFeU5ETTJNRFl5TmpJd05pODJPVFF4T0RFeU56VTROall6WHpBd01WODNOVEJYZURjMU1FZ3w2NGU0MzBjZTQyZjc3Mjc4Mzk2MmQzYzgzNTI0NmFjYWQ2MDc2Zjc3ZGMwYTQ3NWUwMWE5NGUxYjIyMDEzZTI1",gallery:["https://promart.vteximg.com.br/arquivos/ids/9374780/imageUrl_1.jpg?v=638940333571930000","https://i.mi.ua/media/catalog/product/cache/3/image/710x600/602f0fa2c1f0d1ba5e241f914e856ff9/p/1/p16-_1.webp"],alt:"Batería externa Xiaomi Power Bank 10000 mAh 22,5 W Lite",description:"Batería externa de 10.000 mAh con carga rápida de hasta 22,5 W.",specs:["Capacidad de 10.000 mAh","Potencia de salida de hasta 22,5 W","Dos USB-A y un USB-C"],source:"Xiaomi España",sourceUrl:"https://www.mi.com/es/product/xiaomi-power-bank-10000mah-22w-lite/",video:null,videoPage:false,videoLabel:"",variants:["Gris"],imageCredit:"Ktronix / Promart · fotos de producto"},
 {id:"ipadair",name:"Apple iPad Air M4",variant:"11 pulgadas · Wi‑Fi · 128 GB",price:799,category:"tablets",categoryLabel:"Tablet",badge:"Precio de referencia",image:"https://beta-api.bachlongmobile.com/media/catalog/product/cache/bfb35fd1430014b0a164bf3a48626862/i/p/ipad_air_11_m4_wifi_titan_1_2f9cc503aa_1_4.webp",gallery:["https://beta-api.bachlongmobile.com/media/catalog/product/cache/bfb35fd1430014b0a164bf3a48626862/i/p/ipad_air_11_m4_wifi_titan_1_2f9cc503aa_1_4.webp","https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MMS_172146935"],alt:"Apple iPad Air M4, tablet vista frontal y trasera",description:"Tablet ligera para estudiar, trabajar, dibujar y disfrutar de contenido con chip M4 y pantalla Liquid Retina.",specs:["Pantalla Liquid Retina de 11 pulgadas","Chip M4","Compatible con Apple Pencil Pro"],source:"Apple España",sourceUrl:"https://www.apple.com/es/ipad-air/",video:"oT5iDm9XRl8",videoLabel:"Apple · presentación de iPad Air M4",variants:["Azul","Púrpura","Blanco estrella","Gris espacial"],imageCredit:"MediaMarkt · foto de producto / Apple · vídeo oficial"},
 {id:"tabs11",name:"Samsung Galaxy Tab S11",variant:"128 GB · Wi‑Fi",price:null,category:"tablets",categoryLabel:"Tablet",badge:"Precio a consultar",image:"https://media.4rgos.it/i/Argos/7749807_R_Z001A",gallery:["https://media.4rgos.it/i/Argos/7749807_R_Z001A","https://www.pbtech.co.nz/imgprod/T/A/TABSAM73012812.jpg?h=2747982094"],alt:"Samsung Galaxy Tab S11 plata con S Pen",description:"Tablet con pantalla Dynamic AMOLED 2X de 11 pulgadas, S Pen incluido y Samsung DeX.",specs:["Pantalla Dynamic AMOLED 2X de 11 pulgadas","S Pen incluido","Samsung DeX"],source:"Samsung España",sourceUrl:"https://www.samsung.com/es/tablets/galaxy-tab-s/galaxy-tab-s11-silver-128gb-sm-x730nzsreub/",video:null,videoPage:true,videoLabel:"Vídeo y ficha de producto Samsung",variants:["Plata","Gris"],imageCredit:"PBTech / Tanguay · fotos de producto"},
 {id:"watchse3",name:"Apple Watch SE 3",variant:"GPS · 40 mm",price:269,category:"wearables",categoryLabel:"Reloj inteligente",badge:"Precio de referencia",image:"https://bfasset.costco-static.com/U447IH35/as/p39hnnpxr4ct4f8mx4grk7h/4000403247-894_starlight_1?auto=webp&canvas=1024%2C1024&fit=bounds&format=jpg&height=1024&width=1024",gallery:["https://bfasset.costco-static.com/U447IH35/as/p39hnnpxr4ct4f8mx4grk7h/4000403247-894_starlight_1?auto=webp&canvas=1024%2C1024&fit=bounds&format=jpg&height=1024&width=1024","https://iqq6kf0xmf.gjirafa.net/images/9f867e76-64f2-4c48-a366-ddbf2b12ec47/9f867e76-64f2-4c48-a366-ddbf2b12ec47.jpeg"],alt:"Apple Watch SE 3 en color blanco estrella",description:"Reloj inteligente con seguimiento de actividad, GPS, pantalla Retina y funciones de conectividad con iPhone.",specs:["Caja de aluminio de 40 o 44 mm","Chip S10","Hasta 18 horas de autonomía según Apple"],source:"Apple España",sourceUrl:"https://www.apple.com/es/apple-watch-se-3/",video:"H3KnMyojEQU",start:1412,videoLabel:"Apple · presentación Apple Watch SE 3",variants:["Medianoche","Blanco estrella"],imageCredit:"Galaxus · foto de producto"},
 {id:"pixel10",name:"Google Pixel 10",variant:"256 GB",price:649,category:"moviles",categoryLabel:"Smartphone",badge:"Precio Google Store",image:"https://multimedia.bbycastatic.ca/multimedia/products/500x500/193/19363/19363129.jpg",gallery:["https://multimedia.bbycastatic.ca/multimedia/products/500x500/193/19363/19363129.jpg","https://www.proshop.no/Images/915x900/3406117_29453113284e.jpg"],alt:"Google Pixel 10 índigo, vistas trasera, frontal y lateral",description:"Smartphone con Google Tensor G5, Gemini integrado y sistema de cámaras con fotografía computacional.",specs:["256 GB de almacenamiento","Pantalla Actua OLED de 6,3 pulgadas","Google Tensor G5"],source:"Google Store España",sourceUrl:"https://store.google.com/es/product/pixel_10_specs?hl=es",video:null,videoPage:true,videoLabel:"Vídeos y ficha oficial Google",variants:["Índigo","Glaciar","Verde lima","Obsidiana"],imageCredit:"Proshop / Best Buy · fotos de producto"},
 {id:"xiaomi17",name:"Xiaomi 17",variant:"12 GB · 512 GB",price:null,category:"moviles",categoryLabel:"Smartphone",badge:"Precio a consultar",image:"https://shop.urbanrepublic.com.my/cdn/shop/files/Xiaomi17PDP.005.jpg?v=1772364629&width=1445",gallery:["https://shop.urbanrepublic.com.my/cdn/shop/files/Xiaomi17PDP.005.jpg?v=1772364629&width=1445","https://i05.appmifile.com/648_item_pl/10/02/2026/48c1e642f956eb55b8a09ccd30c9dbc1.png?q=85&thumb=1"],alt:"Xiaomi 17 verde, vistas frontal y trasera",description:"Smartphone compacto con óptica Leica, pantalla CrystalRes de 6,3 pulgadas y batería de alta capacidad.",specs:["12 GB de RAM y 512 GB de almacenamiento","Sistema de cámaras Leica de 50 MP","Batería de 6.330 mAh"],source:"Xiaomi España",sourceUrl:"https://www.mi.com/es/product/xiaomi-17/",video:"YaAhIareepg",videoLabel:"Xiaomi · presentación oficial Xiaomi 17",variants:["Verde","Negro","Azul"],imageCredit:"Xiaomi · imagen de producto"},
 {id:"zflip7",name:"Samsung Galaxy Z Flip7",variant:"256 GB",price:null,category:"moviles",categoryLabel:"Smartphone plegable",badge:"Precio a consultar",image:"https://siman.vtexassets.com/arquivos/ids/7070530/104991045-1.jpg?v=638876924761300000",gallery:["https://siman.vtexassets.com/arquivos/ids/7070530/104991045-1.jpg?v=638876924761300000","https://www.gsmpro.cl/cdn/shop/files/samsung-galaxy-z-flip7-7.webp?v=1752081715&width=1500"],alt:"Samsung Galaxy Z Flip7 azul, plegado y abierto",description:"Móvil plegable con pantalla principal Dynamic AMOLED 2X de 6,9 pulgadas y FlexWindow exterior.",specs:["256 GB de almacenamiento","Pantalla principal de 6,9 pulgadas","Cámara principal de 50 MP"],source:"Samsung España",sourceUrl:"https://www.samsung.com/es/smartphones/galaxy-z-flip7/",video:null,videoPage:true,videoLabel:"Vídeos e imágenes oficiales Samsung",variants:["Azul","Negro","Coral"],imageCredit:"Siman / GSMpro · fotos de producto"},
 {id:"iphone17pro",name:"Apple iPhone 17 Pro",variant:"256 GB",price:null,category:"moviles",categoryLabel:"Smartphone Pro",badge:"Precio a consultar",image:"https://www.pbtech.co.nz/imgprod/M/P/MPHAPP817212.jpg?h=3366490703",gallery:["https://www.pbtech.co.nz/imgprod/M/P/MPHAPP817212.jpg?h=3366490703","https://media.ldlc.com/r1600/ld/products/00/06/27/52/LD0006275203.jpg"],alt:"Apple iPhone 17 Pro azul intenso, frontal y trasera",description:"Modelo Pro con sistema de cámaras Fusion, chip A19 Pro y pantalla Super Retina XDR.",specs:["256 GB de almacenamiento","Sistema de cámaras Pro Fusion de 48 MP","Chip A19 Pro"],source:"Apple España",sourceUrl:"https://www.apple.com/es/iphone-17-pro/",video:"H3KnMyojEQU",start:3255,videoLabel:"Apple · presentación iPhone 17 Pro",variants:["Azul intenso","Naranja cósmico","Plata"],imageCredit:"LDLC · foto de producto"},
 {id:"sonywh1000xm6",name:"Sony WH-1000XM6",variant:"Auriculares inalámbricos con Noise Cancelling",price:470,category:"audio",categoryLabel:"Audio premium",badge:"Precio Sony España",image:"https://store.sony.com.tw/resource/file/product_files/WH-1000XM6/02_502da2219.jpg",gallery:["https://store.sony.com.tw/resource/file/product_files/WH-1000XM6/02_502da2219.jpg","https://sonyworld.ae/cdn/shop/files/WH-1000XM6_keyvisual_midnightblue-Large.jpg?v=1750406428&width=1946"],alt:"Auriculares Sony WH-1000XM6 azul Midnight",description:"Auriculares de diadema con cancelación de ruido avanzada, llamadas nítidas y sonido de alta calidad.",specs:["Noise Cancelling con procesador QN1","Conexión multipunto","Hasta 30 horas de autonomía"],source:"Sony España",sourceUrl:"https://www.sony.es/headphones/products/wh-1000xm6",video:"ikhlTRhu3IU",videoLabel:"Sony · vídeo oficial WH-1000XM6",variants:["Azul Midnight","Negro","Plata"],imageCredit:"Sony World · foto de producto"},
 {id:"airpodspro3",name:"Apple AirPods Pro 3",variant:"Estuche MagSafe · USB‑C",price:249,category:"audio",categoryLabel:"Audio",badge:"Precio Apple España",image:"https://s3.us-east-1.amazonaws.com/product-image-bucket-nz-prod-us/462741-Product-1-I-638930627404154176.jpg",gallery:["https://s3.us-east-1.amazonaws.com/product-image-bucket-nz-prod-us/462741-Product-1-I-638930627404154176.jpg","https://static.tildacdn.com/stor3763-3839-4662-b538-363438383265/59357394.png"],alt:"Apple AirPods Pro 3 blancos en su estuche",description:"Auriculares in-ear con cancelación activa de ruido, ajuste mejorado y medición de frecuencia cardiaca en entrenamientos.",specs:["Cancelación activa de ruido","Hasta 8 horas de audio según Apple","Estuche MagSafe con USB‑C"],source:"Apple España",sourceUrl:"https://www.apple.com/es/airpods-pro/",video:null,videoPage:true,videoLabel:"Vídeos y ficha oficial Apple",variants:["Blanco"],imageCredit:"JB Hi-Fi · foto de producto"}
];
function renderDeviceStore(){
 const grid=document.getElementById('device-grid');if(!grid)return;grid.textContent='';
 const countLabel=Array.from(document.querySelectorAll('.page-wrap p')).find(el=>/productos\s*·\s*(móviles|precios orientativos)/i.test(el.textContent));
 if(countLabel)countLabel.textContent=DEVICE_PRODUCTS.length+' dispositivos · fotos, fichas y vídeos cuando los ofrece el fabricante.';
 DEVICE_PRODUCTS.forEach(p=>{
  const card=document.createElement('article');card.className='device-card product-card';card.dataset.category=p.category;card.dataset.keywords=(p.name+' '+p.variant+' '+p.categoryLabel+' '+p.description).toLocaleLowerCase('es');
  const photo=document.createElement('div');photo.className='product-photo';
  const img=document.createElement('img');img.src=p.image;img.alt=p.alt;img.loading='lazy';img.decoding='async';
  const credit=document.createElement('span');credit.className='product-photo-credit';credit.textContent=p.imageCredit||p.source;
  img.onerror=()=>{img.onerror=null;photo.classList.add('image-unavailable');const fallback=document.createElement('div');fallback.className='product-photo-fallback';fallback.innerHTML='<i class="fa-solid fa-mobile-screen-button"></i><span>Foto no disponible · ver ficha del fabricante</span>';photo.replaceChildren(fallback,credit)};
  photo.append(img,credit);
  const gallery=(p.gallery||[p.image]).slice(1);
  if(gallery.length){const strip=document.createElement('div');strip.className='product-card-thumbs';gallery.slice(0,3).forEach((url,index)=>{const thumb=document.createElement('button');thumb.type='button';thumb.className='product-card-thumb';thumb.setAttribute('aria-label','Ver otra foto de '+p.name);const t=document.createElement('img');t.src=url;t.alt=p.name+' · vista '+(index+2);t.loading='lazy';t.onerror=()=>thumb.classList.add('thumb-unavailable');thumb.append(t);thumb.addEventListener('click',()=>{img.src=url});strip.append(thumb)});photo.append(strip)}
  const body=document.createElement('div');body.className='p-4 flex flex-col flex-1';
  const line=document.createElement('div');line.className='flex items-center justify-between gap-2';
  const cat=document.createElement('span');cat.className='eyebrow';cat.textContent=p.categoryLabel;
  const badge=document.createElement('span');badge.className='product-tag';badge.textContent=p.badge;line.append(cat,badge);
  const title=document.createElement('h2');title.className='font-black text-lg text-slate-900 mt-2';title.textContent=p.name;
  const sub=document.createElement('p');sub.className='text-xs muted mt-1';sub.textContent=p.variant;
  const desc=document.createElement('p');desc.className='text-xs muted leading-relaxed mt-3';desc.textContent=p.description;
  const priceWrap=document.createElement('div');priceWrap.className='mt-4';
  const priceLabel=document.createElement('p');priceLabel.className='text-[10px] text-slate-500';priceLabel.textContent=p.price===null?'Precio y disponibilidad por confirmar':'Precio de referencia';
  const price=document.createElement('p');price.className='product-price';price.textContent=p.price===null?'Consultar':euro(p.price);priceWrap.append(priceLabel,price);
  const label=document.createElement('label');label.className='field-label mt-3';label.textContent='Color / acabado';
  const select=document.createElement('select');select.className='form-field';select.id='device-variant-'+p.id;
  p.variants.forEach(v=>{const opt=document.createElement('option');opt.value=v;opt.textContent=v;select.append(opt)});label.append(select);
  const actions=document.createElement('div');actions.className='grid grid-cols-2 gap-2 mt-auto pt-4';
  const add=document.createElement('button');add.className='primary-button !px-2';add.type='button';add.innerHTML='<i class="fa-solid fa-basket-shopping"></i> Añadir';add.addEventListener('click',()=>addDeviceToCart(p.id));
  const detail=document.createElement('button');detail.className='secondary-button !px-2';detail.type='button';detail.innerHTML='<i class="fa-solid fa-images"></i> Ver fotos y vídeo';detail.addEventListener('click',()=>openDeviceMedia(p.id));actions.append(add,detail);
  const source=document.createElement('a');source.className='text-[10px] font-bold text-blue-700 underline mt-3';source.href=p.sourceUrl;source.target='_blank';source.rel='noopener noreferrer';source.textContent='Ficha y fuente: '+p.source;
  body.append(line,title,sub,desc,priceWrap,label,actions,source);card.append(photo,body);grid.append(card);
 });
 filterDevices();
}
function addDeviceToCart(id){
 const p=DEVICE_PRODUCTS.find(x=>x.id===id);if(!p)return;
 const select=document.getElementById('device-variant-'+id),variant=select?select.value:p.variants[0];
 const name=p.name+' · '+p.variant+' · '+variant;
 const detail=p.price===null?'Precio y disponibilidad por confirmar. Consulta con el equipo.':'Precio de referencia visto el 18/11/2026 en '+p.source+'. Precio final y disponibilidad por confirmar.';
 agregarAlCarrito(name,p.price,'producto',detail);
}
function openDeviceMedia(id){
 const p=DEVICE_PRODUCTS.find(x=>x.id===id);if(!p)return;
 const modal=document.getElementById('product-media-modal');if(!modal)return;
 document.getElementById('product-media-title').textContent=p.name;
 document.getElementById('product-media-variant').textContent=p.variant+' · '+(p.price===null?'Precio a consultar':euro(p.price));
 const image=document.getElementById('product-media-image');image.onerror=()=>{image.onerror=null;image.alt='No se ha podido cargar esta foto. Consulta la ficha del fabricante.'};image.src=p.image;image.alt=p.alt;
 const thumbs=document.getElementById('product-gallery-thumbs');if(thumbs){thumbs.textContent='';(p.gallery||[p.image]).forEach((url,index)=>{const button=document.createElement('button');button.type='button';button.className='product-gallery-thumb'+(index===0?' selected':'');button.setAttribute('aria-label','Ver foto '+(index+1)+' de '+p.name);const pic=document.createElement('img');pic.src=url;pic.alt=p.name+' · foto '+(index+1);pic.loading='lazy';pic.onerror=()=>button.classList.add('thumb-unavailable');button.append(pic);button.addEventListener('click',()=>{image.src=url;thumbs.querySelectorAll('button').forEach(x=>x.classList.remove('selected'));button.classList.add('selected')});thumbs.append(button)})}
 document.getElementById('product-media-description').textContent=p.description;
 const specs=document.getElementById('product-media-specs');specs.textContent='';p.specs.forEach(x=>{const li=document.createElement('li');li.textContent=x;specs.append(li)});
 const link=document.getElementById('product-media-source');link.href=p.sourceUrl;link.textContent='Consultar disponibilidad y detalles en '+p.source;
 const frame=document.getElementById('product-video'),wrap=document.getElementById('product-video-wrap'),credit=document.getElementById('product-video-credit'),external=document.getElementById('product-video-external');
 frame.src='';wrap.classList.add('hidden');external.classList.add('hidden');
 if(p.video){frame.src='https://www.youtube-nocookie.com/embed/'+p.video+(p.start?'?start='+p.start:'');frame.title='Vídeo oficial de '+p.name;credit.textContent=p.videoLabel||'Vídeo del fabricante';wrap.classList.remove('hidden');external.href='https://www.youtube.com/watch?v='+p.video;external.textContent='Abrir vídeo en YouTube si no se reproduce';external.classList.remove('hidden')}
 else if(p.videoPage){external.href=p.sourceUrl;external.textContent='Ver vídeos y demostraciones en la web del fabricante';external.classList.remove('hidden')}
 modal.classList.remove('hidden');document.body.style.overflow='hidden';
}
function closeDeviceMedia(){const modal=document.getElementById('product-media-modal');if(!modal)return;modal.classList.add('hidden');document.body.style.overflow='';const frame=document.getElementById('product-video');if(frame)frame.src=''}
function filterDevices(){
 const q=(safeText('device-search')||'').toLocaleLowerCase('es').trim(),category=safeText('device-filter')||'all';let count=0;
 document.querySelectorAll('.product-card').forEach(card=>{const okCat=category==='all'||card.dataset.category===category;const okText=!q||(card.dataset.keywords+' '+card.innerText).toLocaleLowerCase('es').includes(q);card.style.display=okCat&&okText?'flex':'none';if(okCat&&okText)count++});
 const empty=document.getElementById('device-empty');if(empty)empty.classList.toggle('hidden',count!==0);
}
function demoItems(){return cart.filter(x=>x.type==='producto')}
function updateDemoCheckout(){
 const list=document.getElementById('demo-order-items');if(!list)return;list.textContent='';
 const items=demoItems(),warnings=cart.filter(x=>x.type==='tarifa').length;
 if(!items.length){const p=document.createElement('p');p.className='text-sm muted';p.textContent='No hay dispositivos ni accesorios en la cesta. Vuelve a la tienda y añade algún producto.';list.append(p)}
 items.forEach(item=>{
  const row=document.createElement('div');row.className='flex justify-between gap-3 border-b border-slate-200 py-3';
  const info=document.createElement('div'),name=document.createElement('b'),detail=document.createElement('p');
  name.className='block text-sm text-slate-900';name.textContent=item.qty+' × '+item.name;detail.className='small-note mt-1';detail.textContent=item.detail||'';info.append(name,detail);
  const price=document.createElement('b');price.className='text-sm font-black whitespace-nowrap';price.textContent=item.price===null?'Por confirmar':euro(item.price*item.qty);row.append(info,price);list.append(row);
 });
 const total=items.reduce((sum,x)=>sum+(x.price===null?0:x.price*x.qty),0),unknown=items.some(x=>x.price===null);
 document.getElementById('demo-total').textContent=euro(total);
 document.getElementById('demo-price-warning').classList.toggle('hidden',!unknown);
 document.getElementById('demo-tariff-warning').classList.toggle('hidden',!warnings);
 document.getElementById('demo-confirm').disabled=!items.length||unknown;
 document.getElementById('demo-checkout-note').textContent=items.length?'Esta simulación incluye solo dispositivos y accesorios. Las tarifas mensuales no se suman a esta compra de una sola vez.':'Añade productos para continuar.';
}
function initDemoPaymentUI(){
 const box=document.getElementById('demo-payment-details');if(!box)return;
 const options=document.querySelectorAll('input[name="demo-payment"]');
 const draw=()=>{const method=document.querySelector('input[name="demo-payment"]:checked')?.value||'tarjeta';box.textContent='';
  if(method==='tarjeta'){box.innerHTML='<div class="demo-payment-card"><div class="flex justify-between items-start"><span class="text-xs font-black">Tarjeta de prueba</span><span class="demo-card-brand">VISA</span></div><div class="demo-card-number">•••• •••• •••• 4242</div><div class="flex justify-between text-[10px] mt-3"><span>TARJETAHABIENTE<br><b>CLIENTE DEMO</b></span><span>CADUCA<br><b>12/28</b></span><span>CVV<br><b>•••</b></span></div></div><p class="small-note mt-2">Datos de ejemplo bloqueados. No introduzcas datos reales de tarjeta ni códigos de seguridad.</p>'}
  else if(method==='paypal'){box.innerHTML='<div class="demo-pay-provider"><i class="fa-brands fa-paypal"></i><div><b>PayPal · modo de prueba</b><p class="small-note">Se mostraría la redirección segura de PayPal. En esta demo no se abre ni se conecta una cuenta.</p></div></div>'}
  else if(method==='bizum'){box.innerHTML='<div class="demo-pay-provider"><i class="fa-solid fa-mobile-screen-button"></i><div><b>Bizum · modo de prueba</b><p class="small-note">Se mostraría la confirmación de Bizum de tu banco. No se solicita teléfono ni clave.</p></div></div>'}
  else{box.innerHTML='<div class="demo-pay-provider"><i class="fa-solid fa-store"></i><div><b>Pago al recoger en tienda</b><p class="small-note">La persona de tienda confirmaría el método de pago al entregar el producto. No se cobra nada desde esta demostración.</p></div></div>'}
  options.forEach(o=>o.closest('.demo-payment-option')?.classList.toggle('selected',o.checked));
 };
 options.forEach(o=>o.addEventListener('change',draw));draw();
}
function confirmDemoPurchase(){
 const items=demoItems();if(!items.length){toast('Añade un dispositivo o accesorio primero');return}
 if(items.some(x=>x.price===null)){toast('Hay productos sin precio: consulta antes de continuar');return}
 if(!document.getElementById('demo-accept').checked){toast('Confirma que has revisado el resumen y que es un pago ficticio');return}
 const delivery=safeText('demo-delivery'),payment=document.querySelector('input[name="demo-payment"]:checked')?.value||'Tarjeta demo · Visa **** 4242 (simulada)',total=items.reduce((sum,x)=>sum+x.price*x.qty,0);
 const order={id:'DEMO-'+new Date().getFullYear()+'-'+Math.random().toString(36).slice(2,8).toUpperCase(),date:new Date().toISOString(),delivery,payment,total,items:items.map(x=>({...x}))};
 try{const saved=JSON.parse(localStorage.getItem('sanmaximo-demo-orders')||'[]');localStorage.setItem('sanmaximo-demo-orders',JSON.stringify([order,...(Array.isArray(saved)?saved:[])].slice(0,5)));localStorage.setItem('sanmaximo-demo-last-order',JSON.stringify(order))}catch(e){}
 cart=cart.filter(x=>x.type!=='producto');saveCart();renderCart();document.getElementById('demo-checkout-form').classList.add('hidden');document.getElementById('demo-success').classList.remove('hidden');
 document.getElementById('demo-order-id').textContent=order.id;document.getElementById('demo-order-date').textContent=new Date(order.date).toLocaleString('es-ES');document.getElementById('demo-order-delivery').textContent=delivery+' · '+payment;document.getElementById('demo-order-total').textContent=euro(total);
 const receipt=document.getElementById('demo-receipt-lines');receipt.textContent='';items.forEach(x=>{const line=document.createElement('p');line.className='text-xs py-1';line.textContent=x.qty+' × '+x.name+' — '+euro(x.price*x.qty);receipt.append(line)});
 window.scrollTo({top:0,behavior:'smooth'});
}
function downloadDemoReceipt(){
 let order=null;try{order=JSON.parse(localStorage.getItem('sanmaximo-demo-last-order')||'null')}catch(e){}
 if(!order){toast('No hay recibo disponible');return}
 const lines=order.items.map(x=>x.qty+' × '+x.name+' — '+euro(x.price*x.qty)).join('\n');
 const content='SAN MÁXIMO TELECOM · RESUMEN DE COMPRA (SIMULACIÓN)\n\nCódigo: '+order.id+'\nFecha: '+new Date(order.date).toLocaleString('es-ES')+'\nModalidad: '+order.delivery+'\nMétodo de pago (simulado): '+(order.payment||'No indicado')+'\n\n'+lines+'\n\nTOTAL ORIENTATIVO: '+euro(order.total)+'\n\nEste documento es un resumen simulado. No acredita un pedido ni un pago y no se enviará ningún producto.';
 const blob=new Blob([content],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='resumen-compra-san-maximo.txt';a.click();URL.revokeObjectURL(url);
}
document.addEventListener('DOMContentLoaded',()=>{
 renderDeviceStore();updateDemoCheckout();
 const buy=document.getElementById('cart-buy-demo');if(buy)buy.addEventListener('click',proceedToCheckout);
 const confirm=document.getElementById('demo-confirm');if(confirm){confirm.addEventListener('click',confirmDemoPurchase);initDemoPaymentUI()}
 const receipt=document.getElementById('demo-download-receipt');if(receipt)receipt.addEventListener('click',downloadDemoReceipt);
 const close=document.getElementById('product-media-close');if(close)close.addEventListener('click',closeDeviceMedia);
 const modal=document.getElementById('product-media-modal');if(modal)modal.addEventListener('click',e=>{if(e.target===modal)closeDeviceMedia()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDeviceMedia()});
});

function initHomeMotion(){
 const scene=document.querySelector('[data-home-tilt]');
 if(scene&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  scene.addEventListener('pointermove',event=>{const rect=scene.getBoundingClientRect(),x=(event.clientX-rect.left)/rect.width-.5,y=(event.clientY-rect.top)/rect.height-.5;scene.style.setProperty('--tilt-x',(-y*7).toFixed(2)+'deg');scene.style.setProperty('--tilt-y',(x*9).toFixed(2)+'deg')});
  scene.addEventListener('pointerleave',()=>{scene.style.setProperty('--tilt-x','0deg');scene.style.setProperty('--tilt-y','0deg')});
 }
 const cards=document.querySelectorAll('.feature-card,.review-preview-card');
 if('IntersectionObserver' in window&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('home-in');observer.unobserve(entry.target)}}),{threshold:.12});
  cards.forEach(card=>{card.classList.add('home-reveal');observer.observe(card)});
 }else cards.forEach(card=>card.classList.add('home-in'));
}


// ===== Funciones de demostración y experiencia visual =====
function demoRead(key,fallback){try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback))}catch(e){return fallback}}
function demoWrite(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch(e){return false}}
function demoEnhanceReviews(){
 const form=document.getElementById('review-form');if(!form)return;
 const render=()=>{const list=document.getElementById('demo-published-reviews');if(!list)return;list.textContent='';const items=demoRead('sanmaximo-reviews-published',[]);if(!items.length){const empty=document.createElement('p');empty.className='small-note';empty.textContent='Cuando se apruebe una reseña de demostración, aparecerá aquí.';list.append(empty);return}
  items.forEach(x=>{const card=document.createElement('article');card.className='review-public-card';const stars=document.createElement('div');stars.className='text-amber-500 text-sm';stars.textContent='★'.repeat(Number(x.rating))+'☆'.repeat(5-Number(x.rating));const quote=document.createElement('blockquote');quote.textContent=x.text;const person=document.createElement('b');person.textContent=x.name||'Cliente';const category=document.createElement('small');category.className='block text-xs muted mt-1';category.textContent=(x.category||'Experiencia')+' · Reseña de demostración';card.append(stars,quote,person,category);list.append(card)})
 };
 form.addEventListener('submit',e=>{e.preventDefault();e.stopImmediatePropagation();const name=safeText('review-name')||'Cliente',category=safeText('review-category'),rating=Number(safeText('review-rating')),review=safeText('review-text'),consent=document.getElementById('review-consent'),status=document.getElementById('review-status');if(!category||!rating||review.length<20||review.length>900||!consent?.checked){if(status)status.textContent='Completa los campos y acepta la revisión antes de enviar.';return}
  const pending=demoRead('sanmaximo-reviews-pending',[]);pending.unshift({id:Date.now(),name,category,rating,text:review,date:new Date().toISOString()});demoWrite('sanmaximo-reviews-pending',pending);form.reset();const count=document.getElementById('review-count');if(count)count.textContent='0/900';if(status)status.textContent='Reseña guardada como pendiente. En Mi área → Panel de administración demo puedes aprobarla y publicarla en esta página, en este navegador.';
 },true);
 const host=document.querySelector('.reviews-feature-banner');if(host&&!document.getElementById('demo-published-reviews')){const section=document.createElement('section');section.className='mt-8';section.innerHTML='<span class="eyebrow">Publicadas en esta demo</span><h2 class="section-title mt-1">Opiniones compartidas</h2><div id="demo-published-reviews" class="grid md:grid-cols-3 gap-4 mt-4"></div>';host.insertAdjacentElement('afterend',section)}
 render();
}
function initGlobalAuth(){
 const header=document.querySelector('header.site-header'),controls=header?.querySelector('.flex.items-center.gap-2.shrink-0');if(!header||!controls||document.getElementById('global-auth-trigger'))return;
 const trigger=document.createElement('button');trigger.type='button';trigger.id='global-auth-trigger';trigger.className='global-auth-trigger';trigger.innerHTML='<i class="fa-regular fa-user"></i><span>Iniciar sesión</span>';trigger.setAttribute('aria-label','Iniciar sesión o registrarse');trigger.title='Iniciar sesión o registrarse';controls.insertBefore(trigger,controls.firstChild);
 const mobileNav=document.getElementById('mobile-nav');if(mobileNav&&!mobileNav.querySelector('[data-auth-open]')){const link=document.createElement('a');link.href='#demo-auth-modal';link.dataset.authOpen='1';link.className='mobile-auth-link';link.innerHTML='<i class="fa-regular fa-user"></i> Iniciar sesión / Registrarse';mobileNav.append(link);link.addEventListener('click',e=>{e.preventDefault();openDemoAuth()})}
 const modal=document.createElement('div');modal.id='demo-auth-modal';modal.className='demo-auth-overlay hidden';modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-labelledby','demo-auth-title');
 modal.innerHTML='<section class="demo-auth-panel"><header class="demo-auth-head"><div><span class="eyebrow">Área de cliente</span><h2 id="demo-auth-title">Tu cuenta San Máximo</h2><p>Accede o crea una cuenta para la demostración.</p></div><button type="button" id="demo-auth-close" aria-label="Cerrar"><i class="fa-solid fa-xmark"></i></button></header><div id="demo-auth-content"><div class="demo-auth-tabs"><button type="button" class="active" data-auth-tab="login">Iniciar sesión</button><button type="button" data-auth-tab="register">Registrarse</button></div><form id="demo-login-form" class="demo-auth-form"><label class="field-label">Correo electrónico<input id="demo-login-email" class="form-field" type="email" autocomplete="off" placeholder="cliente@ejemplo.com" required></label><label class="field-label">Contraseña de demostración<input id="demo-login-pass" class="form-field" type="password" autocomplete="off" minlength="4" placeholder="Mínimo 4 caracteres" required></label><button class="primary-button w-full" type="submit">Entrar en mi cuenta</button><p class="small-note">Modo demostración: puedes utilizar datos inventados. No se valida ninguna cuenta real y no guardamos contraseñas.</p></form><form id="demo-register-form" class="demo-auth-form hidden"><label class="field-label">Nombre o alias<input id="demo-register-name" class="form-field" maxlength="50" placeholder="Cómo quieres que te llamemos" required></label><label class="field-label">Correo electrónico de prueba<input id="demo-register-email" class="form-field" type="email" placeholder="cliente@ejemplo.com" required></label><label class="field-label">Crea una contraseña ficticia<input id="demo-register-pass" class="form-field" type="password" minlength="4" autocomplete="off" placeholder="Mínimo 4 caracteres" required></label><button class="primary-button w-full" type="submit">Crear cuenta demo</button><p class="small-note">La cuenta solo se recuerda en este navegador para la presentación. No uses una contraseña real.</p></form><p id="demo-auth-status" class="demo-auth-status" aria-live="polite"></p></div><div id="demo-auth-session" class="hidden"><div class="demo-session-card"><span class="demo-session-icon"><i class="fa-solid fa-user-check"></i></span><div><b>Has iniciado sesión en la demo</b><p id="demo-session-name" class="small-note"></p></div></div><div class="grid sm:grid-cols-2 gap-2 mt-4"><a href="clientes.html" class="secondary-button justify-center">Mi área de cliente</a><button type="button" id="demo-admin-open" class="secondary-button">Panel de administración demo</button></div><button id="demo-auth-logout" type="button" class="text-xs font-extrabold text-blue-700 underline mt-4">Cerrar sesión</button><p class="small-note mt-3">Este acceso no consulta líneas, facturas ni datos reales de clientes.</p><div id="demo-admin-panel" class="hidden mt-5 border-t border-slate-200 pt-5"><h3 class="font-black text-slate-900">Revisión de reseñas</h3><p class="small-note mt-1">Las reseñas aprobadas se muestran en esta demo en el navegador actual.</p><div id="demo-review-queue" class="grid gap-3 mt-3"></div></div></div></section>';
 document.body.append(modal);
 const tabs=modal.querySelectorAll('[data-auth-tab]'),login=modal.querySelector('#demo-login-form'),register=modal.querySelector('#demo-register-form'),content=modal.querySelector('#demo-auth-content'),sessionBox=modal.querySelector('#demo-auth-session'),status=modal.querySelector('#demo-auth-status');
 function setTab(name){tabs.forEach(t=>t.classList.toggle('active',t.dataset.authTab===name));login.classList.toggle('hidden',name!=='login');register.classList.toggle('hidden',name!=='register');status.textContent=''}
 function readSession(){return demoRead('sanmaximo-demo-session',null)}
 function drawSession(){const current=readSession();const active=!!current;content.classList.toggle('hidden',active);sessionBox.classList.toggle('hidden',!active);trigger.classList.toggle('signed-in',active);trigger.querySelector('span').textContent=active?'Mi cuenta':'Iniciar sesión';if(active)modal.querySelector('#demo-session-name').textContent=(current.name||current.user||'Cliente')+' · cuenta ficticia';}
 function renderQueue(){const box=modal.querySelector('#demo-review-queue');box.textContent='';const pending=demoRead('sanmaximo-reviews-pending',[]);if(!pending.length){box.textContent='No hay reseñas pendientes de revisión.';return}
  pending.forEach(item=>{const card=document.createElement('article');card.className='rounded-xl border border-slate-200 p-3';const title=document.createElement('b');title.textContent=(item.name||'Cliente')+' · '+item.rating+'/5 · '+(item.category||'Experiencia');const quote=document.createElement('p');quote.className='small-note my-2';quote.textContent=item.text;const actions=document.createElement('div');actions.className='flex gap-2';const approve=document.createElement('button');approve.type='button';approve.className='primary-button';approve.textContent='Aprobar y publicar';approve.addEventListener('click',()=>{const queue=demoRead('sanmaximo-reviews-pending',[]).filter(x=>x.id!==item.id),published=demoRead('sanmaximo-reviews-published',[]);published.unshift(item);demoWrite('sanmaximo-reviews-pending',queue);demoWrite('sanmaximo-reviews-published',published);renderQueue();toast('Reseña aprobada en esta demo')});const reject=document.createElement('button');reject.type='button';reject.className='secondary-button';reject.textContent='Rechazar';reject.addEventListener('click',()=>{demoWrite('sanmaximo-reviews-pending',demoRead('sanmaximo-reviews-pending',[]).filter(x=>x.id!==item.id));renderQueue()});actions.append(approve,reject);card.append(title,quote,actions);box.append(card)})
 }
 function openDemoAuth(){modal.classList.remove('hidden');drawSession();if(!readSession())setTab('login');document.body.style.overflow='hidden'}
 function closeDemoAuth(){modal.classList.add('hidden');document.body.style.overflow=''}
 window.openDemoAuth=openDemoAuth;
 trigger.addEventListener('click',openDemoAuth);
 modal.querySelector('#demo-auth-close').addEventListener('click',closeDemoAuth);
 modal.addEventListener('click',e=>{if(e.target===modal)closeDemoAuth()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.classList.contains('hidden'))closeDemoAuth()});
 tabs.forEach(t=>t.addEventListener('click',()=>setTab(t.dataset.authTab)));
 login.addEventListener('submit',e=>{e.preventDefault();const email=modal.querySelector('#demo-login-email').value.trim(),pass=modal.querySelector('#demo-login-pass').value;if(!email||pass.length<4){status.textContent='Revisa el correo y la contraseña ficticia (4 caracteres como mínimo).';return}demoWrite('sanmaximo-demo-session',{user:email,name:email.split('@')[0],at:new Date().toISOString()});drawSession()});
 register.addEventListener('submit',e=>{e.preventDefault();const name=modal.querySelector('#demo-register-name').value.trim(),email=modal.querySelector('#demo-register-email').value.trim(),pass=modal.querySelector('#demo-register-pass').value;if(!name||!email||pass.length<4){status.textContent='Completa los datos de demostración.';return}demoWrite('sanmaximo-demo-session',{user:email,name,at:new Date().toISOString(),registered:true});drawSession()});
 modal.querySelector('#demo-auth-logout').addEventListener('click',()=>{localStorage.removeItem('sanmaximo-demo-session');modal.querySelector('#demo-admin-panel').classList.add('hidden');drawSession();setTab('login')});
 modal.querySelector('#demo-admin-open').addEventListener('click',()=>{const pin=prompt('Código del panel de administración demo:');if(pin!=='2468'){toast('Código incorrecto');return}const panel=modal.querySelector('#demo-admin-panel');panel.classList.toggle('hidden');renderQueue()});
 drawSession();
}

// Old centred sign-in panel removed: account access now lives in the shared header.
function demoEnhanceClientArea(){}
function demoInvoiceBuilder(){
 if(!document.getElementById('invoice-file')||document.getElementById('personal-invoice-tool'))return;
 const main=document.querySelector('main .page-wrap');if(!main)return;
 const section=document.createElement('section');section.id='personal-invoice-tool';section.className='surface p-5 sm:p-7 mb-7';section.innerHTML='<span class="eyebrow">Tu estudio personalizado</span><h2 class="section-title mt-1">Prepara una factura comparativa a tu medida</h2><p class="text-xs muted mt-2">No hace falta subir una factura: indica el gasto aproximado y te prepararemos un informe claro con comparativa y gráfica. Es un estudio orientativo, no una factura fiscal.</p><div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5"><label class="field-label">Servicio<select id="quick-invoice-type" class="form-field"><option>Fibra y móvil</option><option>Solo móvil</option><option>Internet en casa</option><option>Luz</option><option>Gas</option><option>Luz y gas</option></select></label><label class="field-label">¿Cuánto pagas al mes? (€)<input id="quick-invoice-current" class="form-field" type="number" min="0.01" step=".01" placeholder="Ej. 65" required></label><label class="field-label">Personas o líneas (opcional)<input id="quick-invoice-units" class="form-field" type="number" min="1" max="20" placeholder="Ej. 3"></label><label class="field-label">Consumo o detalle (opcional)<input id="quick-invoice-detail" class="form-field" placeholder="Ej. 300 kWh, 2 móviles…"></label><label class="field-label">Otra oferta mensual (€) (opcional)<input id="quick-invoice-offer" class="form-field" type="number" min="0" step=".01" placeholder="Ej. 49,90"></label></div><button id="quick-invoice-generate" class="primary-button mt-5"><i class="fa-solid fa-file-circle-check"></i> Generar mi estudio</button><div id="quick-invoice-output" class="mt-5" aria-live="polite"></div>';
 main.insertBefore(section,main.children[1]||null);
 section.querySelector('#quick-invoice-generate').addEventListener('click',()=>{const current=Number(safeText('quick-invoice-current')),offerText=safeText('quick-invoice-offer'),offer=offerText===''?null:Number(offerText);if(!Number.isFinite(current)||current<=0||offer!==null&&(!Number.isFinite(offer)||offer<0)){toast('Introduce un gasto mensual válido');return}
  const saving=offer===null?null:current-offer,annual=current*12,out=section.querySelector('#quick-invoice-output');out.textContent='';
  const card=document.createElement('div');card.className='invoice-study-card rounded-2xl border border-blue-100 bg-blue-50 p-5';const h=document.createElement('h3');h.className='font-black text-slate-900';h.textContent='Estudio de '+safeText('quick-invoice-type');const p=document.createElement('p');p.className='text-xs text-slate-600 mt-2';p.textContent='Gasto indicado: '+euro(current)+'/mes · '+euro(annual)+'/año'+(safeText('quick-invoice-units')?' · '+safeText('quick-invoice-units')+' personas o líneas':'')+(safeText('quick-invoice-detail')?' · '+safeText('quick-invoice-detail'):'');
  const bars=document.createElement('div');bars.className='grid gap-3 mt-4';const addBar=(label,value,max)=>{const box=document.createElement('div');const cap=document.createElement('div');cap.className='flex justify-between text-xs font-bold';const name=document.createElement('span');name.textContent=label;const amount=document.createElement('span');amount.textContent=euro(value)+'/mes';cap.append(name,amount);const track=document.createElement('div');track.className='h-3 rounded-full bg-white overflow-hidden mt-1';const fill=document.createElement('div');fill.className='h-full rounded-full bg-blue-600';fill.style.width=Math.max(2,Math.min(100,value/Math.max(max,1)*100))+'%';track.append(fill);box.append(cap,track);bars.append(box)};
  addBar('Gasto actual',current,Math.max(current,offer||current));if(offer!==null)addBar('Oferta alternativa',offer,Math.max(current,offer));
  const summary=document.createElement('p');summary.className='font-black text-lg mt-4';summary.textContent=saving===null?'Gasto anual estimado: '+euro(annual):saving>0?'Ahorro estimado: '+euro(saving)+'/mes · '+euro(saving*12)+'/año':saving<0?'La alternativa costaría '+euro(-saving)+'/mes más.':'Las dos cantidades son iguales.';
  const note=document.createElement('p');note.className='small-note mt-3';note.textContent='Cálculo basado únicamente en los datos introducidos. No incluye conceptos desconocidos ni garantiza precios de operadores.';
  const print=document.createElement('button');print.className='secondary-button mt-4';print.type='button';print.textContent='Guardar este estudio en PDF';print.addEventListener('click',()=>{const title='Estudio de '+safeText('quick-invoice-type'),detail=p.textContent,barRows=[['Gasto actual',current],...(offer===null?[]:[['Oferta alternativa',offer]])],max=Math.max(current,offer||current,1);const html='<!doctype html><html lang="es"><head><meta charset="utf-8"><title>'+title+'</title><style>body{font:15px Arial,sans-serif;color:#172b48;margin:36px;line-height:1.5}h1{color:#1d4ed8}.bar{margin:18px 0}.track{height:14px;background:#e7eef8;border-radius:20px;overflow:hidden}.fill{height:100%;background:#2563eb}.amount{float:right;font-weight:bold}.note{color:#64748b;font-size:12px;margin-top:28px}</style></head><body><h1>San Máximo Telecom</h1><h2>'+title+'</h2><p>'+detail+'</p>'+barRows.map(x=>'<div class="bar"><span>'+x[0]+'</span><span class="amount">'+euro(x[1])+'/mes</span><div class="track"><div class="fill" style="width:'+Math.max(2,Math.min(100,x[1]/max*100))+'%"></div></div></div>').join('')+'<h2>'+summary.textContent+'</h2><p class="note">Estudio orientativo creado con los datos proporcionados. No es factura fiscal, contrato ni oferta vinculante.</p><script>window.onload=()=>window.print();</script></body></html>';const win=window.open('','_blank','width=820,height=720');if(!win){toast('Permite las ventanas emergentes para guardar el PDF');return}win.document.open();win.document.write(html);win.document.close()});card.append(h,p,bars,summary,note,print);out.append(card)
 });
}
function demoEnergyCharts(){
 if(!document.getElementById('energy-compare-result')||document.getElementById('energy-chart-note'))return;
 const out=document.getElementById('energy-compare-result'),note=document.createElement('p');note.id='energy-chart-note';note.className='small-note mt-3';note.textContent='Al comparar, se mostrará una gráfica de costes mensuales y anuales.';out.after(note);
 const oldCompare=window.compareEnergy;if(typeof oldCompare!=='function')return;
 window.compareEnergy=function(){oldCompare();const ids=['energy-compare-usage','energy-a-unit','energy-a-fixed','energy-b-unit','energy-b-fixed'],raw=ids.map(id=>safeText(id)),values=raw.map(Number);if(raw.some(x=>x==='')||values.some(x=>!Number.isFinite(x)||x<0))return;const [usage,aUnit,aFixed,bUnit,bFixed]=values,a=usage*aUnit+aFixed,b=usage*bUnit+bFixed;
  let chart=document.getElementById('energy-visual-chart');if(!chart){chart=document.createElement('div');chart.id='energy-visual-chart';chart.className='mt-4 rounded-xl bg-white p-4';note.after(chart)}chart.textContent='';const heading=document.createElement('h3');heading.className='font-black text-sm mb-3';heading.textContent='Comparativa visual';chart.append(heading);
  [['Oferta A',a],['Oferta B',b]].forEach(([label,value])=>{const row=document.createElement('div');row.className='mb-3';const head=document.createElement('div');head.className='flex justify-between text-xs font-bold';const name=document.createElement('span');name.textContent=label;const amount=document.createElement('span');amount.textContent=euro(value)+'/mes';head.append(name,amount);const track=document.createElement('div');track.className='h-4 bg-slate-100 rounded-full overflow-hidden mt-1';const fill=document.createElement('div');fill.className='h-full bg-blue-600 rounded-full';fill.style.width=Math.max(2,value/Math.max(a,b,1)*100)+'%';track.append(fill);row.append(head,track);chart.append(row)});
  const annual=document.createElement('p');annual.className='text-xs font-black text-blue-700 mt-3';annual.textContent='Coste anual estimado: A '+euro(a*12)+' · B '+euro(b*12);chart.append(annual)
 }
}
function demoSpinPhone(){
 const scene=document.querySelector('[data-home-tilt]'),phone=scene?.querySelector('.scene-phone');if(!scene||!phone||scene.dataset.dragPhoneReady)return;scene.dataset.dragPhoneReady='1';
 let dragging=false,lastX=0,lastY=0,rotationY=-17,rotationX=7;
 const paint=()=>{phone.style.transform='rotateX('+rotationX+'deg) rotateY('+rotationY+'deg) rotateZ(-7deg)'};
 phone.style.cursor='grab';phone.style.touchAction='pan-y';phone.title='Arrastra para girar el móvil · doble clic para centrar';
 phone.addEventListener('pointerdown',event=>{if(event.button!==0&&event.pointerType==='mouse')return;dragging=true;lastX=event.clientX;lastY=event.clientY;phone.setPointerCapture?.(event.pointerId);phone.style.cursor='grabbing';event.preventDefault()});
 phone.addEventListener('pointermove',event=>{if(!dragging)return;rotationY=Math.max(-70,Math.min(70,rotationY+(event.clientX-lastX)*.7));rotationX=Math.max(-35,Math.min(35,rotationX-(event.clientY-lastY)*.45));lastX=event.clientX;lastY=event.clientY;paint()});
 const stop=()=>{dragging=false;phone.style.cursor='grab'};phone.addEventListener('pointerup',stop);phone.addEventListener('pointercancel',stop);phone.addEventListener('dblclick',()=>{rotationX=7;rotationY=-17;paint()});
 if(!scene.querySelector('.phone-spin-hint')){const hint=document.createElement('span');hint.className='phone-spin-hint';hint.innerHTML='<i class="fa-solid fa-hand-pointer"></i> Arrastra el móvil para girarlo · doble clic para centrar';scene.append(hint)}
}
function demoAppointmentRequest(){
 const btn=document.getElementById('visit-request');if(!btn||btn.dataset.appointmentReady)return;btn.dataset.appointmentReady='1';
 btn.addEventListener('click',event=>{event.preventDefault();const d=safeText('visit-date'),t=safeText('visit-time'),store=safeText('visit-store'),reason=safeText('visit-reason');if(!d||!t||!reason){toast('Indica tienda, fecha, hora y motivo de la cita');return}const start=new Date(d+'T'+t+':00');if(Number.isNaN(start.getTime())||start<new Date()){toast('Elige una fecha y hora futuras');return}
  makeCalendarReminder();const subject='Solicitud de cita · San Máximo Telecom',body='Hola, me gustaría solicitar una cita.\n\nTienda: '+store+'\nFecha preferida: '+d+'\nHora preferida: '+t+'\nMotivo: '+reason+'\n\nQuedo pendiente de confirmación por parte de la tienda.';window.location.href='mailto:'+GENERAL_EMAIL+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);const status=document.getElementById('visit-status');if(status)status.textContent='Se ha preparado el correo para solicitar la cita y descargado un recordatorio provisional. La tienda debe confirmar fecha y hora.'
 });
}
function demoEnergyInvoice(){
 const main=document.querySelector('main .page-wrap');if(!main||!document.getElementById('energy-kwh')||document.getElementById('energy-personal-study'))return;
 const section=document.createElement('section');section.id='energy-personal-study';section.className='surface p-5 sm:p-7 mb-7';section.innerHTML='<span class="eyebrow">Tu factura de energía, más clara</span><h2 class="section-title mt-1">Crea tu estudio personalizado de luz y gas</h2><p class="text-xs muted mt-2">Sin subir facturas ni documentos: indica cuánto pagas y tu consumo aproximado. Obtendrás un resumen visual y podrás guardarlo en PDF.</p><div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5"><label class="field-label">Servicio<select id="energy-study-type" class="form-field"><option>Electricidad</option><option>Gas</option><option>Luz y gas</option></select></label><label class="field-label">Pago mensual (€)<input id="energy-study-current" class="form-field" type="number" min="0.01" step=".01" placeholder="Ej. 85"></label><label class="field-label">Consumo mensual (kWh)<input id="energy-study-kwh" class="form-field" type="number" min="0" step=".1" placeholder="Ej. 240"></label><label class="field-label">Costes fijos incluidos (€)<input id="energy-study-fixed" class="form-field" type="number" min="0" step=".01" value="0"></label><label class="field-label lg:col-span-2">Otra oferta mensual (opcional) (€)<input id="energy-study-offer" class="form-field" type="number" min="0" step=".01" placeholder="Ej. 72"></label></div><button id="energy-study-generate" class="primary-button mt-5"><i class="fa-solid fa-file-invoice-dollar"></i> Crear mi factura mejorada</button><div id="energy-study-result" class="mt-5" aria-live="polite"></div>';
 const before=main.querySelector('.grid.lg\\:grid-cols-2');main.insertBefore(section,before||main.children[1]||null);
 section.querySelector('#energy-study-generate').addEventListener('click',()=>{const type=safeText('energy-study-type'),current=Number(safeText('energy-study-current')),kwh=safeText('energy-study-kwh')===''?null:Number(safeText('energy-study-kwh')),fixed=safeText('energy-study-fixed')===''?0:Number(safeText('energy-study-fixed')),offerText=safeText('energy-study-offer'),offer=offerText===''?null:Number(offerText);
  if(!Number.isFinite(current)||current<=0||kwh!==null&&(!Number.isFinite(kwh)||kwh<0)||!Number.isFinite(fixed)||fixed<0||offer!==null&&(!Number.isFinite(offer)||offer<0)){toast('Revisa los importes y el consumo');return}
  const annual=current*12,variable=Math.max(0,current-fixed),saving=offer===null?null:current-offer,max=Math.max(current,offer||current,1),result=section.querySelector('#energy-study-result');result.textContent='';
  const card=document.createElement('div');card.className='invoice-study-card rounded-2xl border border-blue-100 bg-blue-50 p-5';const h=document.createElement('h3');h.className='font-black text-slate-900 text-lg';h.textContent='Resumen personalizado · '+type;const p=document.createElement('p');p.className='text-xs text-slate-600 mt-2';p.textContent='Estimación mensual: '+euro(current)+' · Anual: '+euro(annual)+(kwh===null?'':' · Consumo indicado: '+kwh.toLocaleString('es-ES')+' kWh');const bars=document.createElement('div');bars.className='grid gap-3 mt-4';
  const addBar=(label,value,colour)=>{const row=document.createElement('div'),head=document.createElement('div');head.className='flex justify-between text-xs font-bold';const name=document.createElement('span'),amount=document.createElement('span');name.textContent=label;amount.textContent=euro(value);head.append(name,amount);const track=document.createElement('div');track.className='h-3 rounded-full bg-white overflow-hidden mt-1';const fill=document.createElement('div');fill.className='h-full rounded-full '+colour;fill.style.width=Math.max(2,Math.min(100,value/max*100))+'%';track.append(fill);row.append(head,track);bars.append(row)};
  addBar('Gasto mensual',current,'bg-blue-600');if(fixed>0)addBar('Costes fijos incluidos',fixed,'bg-cyan-500');if(kwh!==null)addBar('Consumo indicado',current,'bg-indigo-500');
  const summary=document.createElement('p');summary.className='font-black text-lg mt-4';summary.textContent=saving===null?'Coste anual estimado: '+euro(annual):saving>0?'Diferencia estimada: '+euro(saving)+'/mes · '+euro(saving*12)+'/año menos':saving<0?'La otra oferta costaría '+euro(-saving)+'/mes más.':'Las dos opciones cuestan lo mismo.';
  const note=document.createElement('p');note.className='small-note mt-3';note.textContent='Informe orientativo elaborado con los datos que has indicado. No sustituye la factura de tu comercializadora ni incluye conceptos que no hayas añadido.';
  const save=document.createElement('button');save.className='secondary-button mt-4';save.type='button';save.textContent='Guardar estudio en PDF';save.addEventListener('click',()=>{const html='<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Estudio de energía · San Máximo Telecom</title><style>body{font:15px Arial;color:#172b48;margin:36px;line-height:1.5}h1{color:#1d4ed8}.bar{margin:18px 0}.track{height:14px;background:#e7eef8;border-radius:20px;overflow:hidden}.fill{height:100%;background:#2563eb}.amount{float:right;font-weight:bold}.note{font-size:12px;color:#64748b;margin-top:28px}</style></head><body><h1>San Máximo Telecom</h1><h2>Estudio de '+type+'</h2><p>'+p.textContent+'</p><p>Gasto mensual variable estimado: '+euro(variable)+' · Costes fijos declarados: '+euro(fixed)+'</p><p>'+summary.textContent+'</p><p class="note">Documento de orientación elaborado con datos introducidos por el usuario. No es factura fiscal, oferta vinculante ni garantía de ahorro.</p><script>window.onload=()=>window.print();</script></body></html>';const win=window.open('','_blank','width=820,height=720');if(!win){toast('Permite ventanas emergentes para guardar el PDF');return}win.document.open();win.document.write(html);win.document.close()});
  card.append(h,p,bars,summary,note,save);result.append(card)
 });
}
function initDemoEnhancements(){demoEnhanceReviews();demoInvoiceBuilder();demoEnergyCharts();demoEnergyInvoice();demoSpinPhone();demoAppointmentRequest()}
document.addEventListener('DOMContentLoaded',initDemoEnhancements);
