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
 let title='Elige tus servicios',description='Selecciona fibra o al menos una línea móvil.',promo=0,months=0,normal=0,year=0,detail='',advice='Selecciona los servicios que necesitáis para obtener una estimación.',valid=fibre||lines>0;
 if(fibre&&lines===0){title='Fibra 600 Mb';description='Internet en casa sin líneas móviles incluidas.';promo=19.90;months=12;normal=29.90;detail='Fibra 600 Mb';advice='La tarifa publicada indica 19,90 €/mes durante 12 meses y después 29,90 €/mes. Revisa el compromiso de instalación.'}
 else if(fibre&&lines===1){title='Fibra 600 Mb + 80 GB';description='Fibra y una línea móvil con llamadas ilimitadas.';promo=53;normal=53;detail='Fibra 600 Mb + 80 GB';advice='La tarifa publicada indica 53 €/mes. Confirma que es la opción adecuada para una línea.'}
 else if(fibre&&lines>=2){const extra=lines-2;title='Fibra 600 Mb + '+lines+' líneas';description='Paquete de fibra con dos líneas y líneas adicionales estimadas.';promo=49+extra*14;months=3;normal=55+extra*14;detail='Fibra 600 Mb + 2 líneas'+(extra?' + '+extra+' línea(s) adicional(es) estimada(s)':'');advice=extra?'Las líneas adicionales se estiman a 14 €/mes cada una. La empresa debe confirmar compatibilidad y disponibilidad.':'Paquete publicado con 50 GB compartidos entre dos líneas.'}
 else if(!fibre&&lines>0){title=lines+' línea(s) móvil(es)';description='Tarifa de 35 GB y llamadas ilimitadas por línea.';promo=lines*14;normal=lines*14;detail=lines+' × 35 GB + llamadas ilimitadas';advice='Cálculo basado en una tarifa móvil individual de 14 €/mes por línea.'}
 if(valid)year=months?promo*months+normal*(12-months):normal*12;
 if(usage==='intensive')advice+=' Para streaming y teletrabajo, revisa la cobertura disponible en casa.';
 if(usage==='gaming')advice+=' Para juegos y muchos dispositivos, confirma la cobertura y el rendimiento de la fibra.';
 const fmt=n=>Number(n).toLocaleString('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2})+' €';
 const set=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value};
 set('quote-title',title);set('quote-description',people+' persona(s) en el hogar · '+lines+' línea(s) móvil(es) · '+(fibre?'con fibra 600 Mb':'sin fibra')+'. '+description);
 set('quote-promo',valid?fmt(promo)+'/mes':'—');set('quote-normal',valid?fmt(normal)+'/mes':'—');
 set('quote-promo-period',valid?(months?'Durante '+months+' meses':'Sin promoción temporal indicada'):'Añade un servicio');
 set('quote-normal-period',valid?(months?'Después de la promoción':'Cuota mensual'):'—');
 set('quote-year',valid?fmt(year):'—');set('quote-advice',advice+' Precios públicos de referencia con IVA incluido; sujetos a confirmación.');
 window.householdQuote={people,lines,fibre,usage,title,description,promo,months,normal,year,detail,advice,valid};
 return window.householdQuote;
}
function printHouseholdQuote(){
 const q=calculateHouseholdQuote();if(!q.valid){toast('Selecciona fibra o al menos una línea móvil');return}
 const fmt=n=>Number(n).toLocaleString('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2})+' €';
 const popup=window.open('','_blank','width=820,height=720');if(!popup){toast('Permite las ventanas emergentes para guardar el presupuesto');return}
 const html='<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Presupuesto orientativo · San Máximo Telecom</title><style>body{font-family:Arial,sans-serif;color:#172b48;margin:40px;line-height:1.5}header{border-bottom:3px solid #2563eb;padding-bottom:18px}.brand{font-weight:900;color:#1d4ed8}h1{font-size:26px}table{width:100%;border-collapse:collapse;margin:25px 0}td,th{text-align:left;padding:12px;border-bottom:1px solid #dce5f0}.summary{background:#eff6ff;border-radius:12px;padding:18px}.summary b{font-size:22px;color:#1d4ed8}.foot{margin-top:30px;border-top:1px solid #dce5f0;padding-top:15px;font-size:11px;color:#596b80}@media print{body{margin:18mm}}</style></head><body><header><div class="brand">SAN MÁXIMO TELECOM</div><h1>Presupuesto orientativo para el hogar</h1><small>Fecha: '+new Date().toLocaleDateString('es-ES')+'</small></header><p><b>Personas:</b> '+q.people+' · <b>Líneas:</b> '+q.lines+' · <b>Fibra:</b> '+(q.fibre?'Sí, 600 Mb':'No')+'</p><table><tr><th>Propuesta</th><th>Detalle</th><th>Cuota inicial</th></tr><tr><td>'+q.title+'</td><td>'+q.detail+'</td><td>'+fmt(q.promo)+'/mes</td></tr></table><div class="summary"><p><b>Cuota inicial:</b> '+fmt(q.promo)+'/mes'+(q.months?' durante '+q.months+' meses':'')+'</p><p><b>Después:</b> '+fmt(q.normal)+'/mes</p><p><b>Coste estimado del primer año:</b> '+fmt(q.year)+'</p></div><p>'+q.advice+'</p><div class="foot">Documento informativo basado en los precios de referencia publicados en esta web, con IVA incluido. No es una factura fiscal, contrato ni oferta vinculante. Cobertura, disponibilidad, compatibilidad y condiciones deben confirmarse con San Máximo Telecom. Teléfono de contacto: 923 24 43 69.</div><script>window.onload=()=>window.print();</script></body></html>';
 popup.document.open();popup.document.write(html);popup.document.close();
}
function initHouseholdQuote(){
 const people=document.getElementById('quote-people'),lines=document.getElementById('quote-lines'),fibre=document.getElementById('quote-fibre'),usage=document.getElementById('quote-use');
 if(!people||!lines||!fibre||!usage)return;
 people.addEventListener('change',()=>{lines.value=String(Math.min(8,Number(people.value)));calculateHouseholdQuote()});
 [lines,fibre,usage].forEach(el=>el.addEventListener('change',calculateHouseholdQuote));
 document.getElementById('quote-calculate')?.addEventListener('click',calculateHouseholdQuote);
 document.getElementById('quote-print')?.addEventListener('click',printHouseholdQuote);
 document.getElementById('quote-add')?.addEventListener('click',()=>{const q=calculateHouseholdQuote();if(!q.valid){toast('Selecciona fibra o alguna línea móvil');return}agregarAlCarrito(q.title,q.promo,'tarifa',q.detail+' · después '+q.normal.toFixed(2).replace('.',',')+' €/mes · presupuesto orientativo para '+q.people+' persona(s)')});
 calculateHouseholdQuote();
}

function initPortal(){
 try{if(localStorage.getItem('sanmaximo-theme')==='dark')document.body.classList.add('dark-mode')}catch(e){}
 updateThemeButton();loadCart();initHomeMotion();initGlobalSearch();initHouseholdQuote();
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
 const maxi=document.getElementById('maxi-launcher');if(maxi)maxi.addEventListener('click',toggleMaxi);
 const closeMaxi=document.getElementById('maxi-close');if(closeMaxi)closeMaxi.addEventListener('click',toggleMaxi);
 document.querySelectorAll('[data-maxi]').forEach(b=>b.addEventListener('click',()=>presetMaxi(b.dataset.maxi)));
 const reviewForm=document.getElementById('review-form');if(reviewForm)reviewForm.addEventListener('submit',sendReviewRequest);
 const params=new URLSearchParams(location.search),requestMessage=document.getElementById('request-message');if(requestMessage&&!requestMessage.value.trim()){const type=params.get('tipo');if(params.get('origen')==='carrito')requestMessage.value='Me gustaría recibir información sobre los productos y tarifas que he añadido a mi solicitud. Por favor, confirmad disponibilidad, cobertura y condiciones.';else if(type==='empresa')requestMessage.value='Me gustaría solicitar información sobre soluciones de conectividad y telecomunicaciones para mi empresa.';else if(type==='energia')requestMessage.value='Me gustaría recibir asesoramiento sobre una oferta de luz o gas.';else if(type==='factura')requestMessage.value='Me gustaría recibir ayuda para revisar mi factura y comparar alternativas.'}
}
document.addEventListener('DOMContentLoaded',initPortal);

const DEVICE_PRODUCTS=[{"id":"iphone17","name":"Apple iPhone 17","variant":"256 GB","price":1109,"category":"moviles","categoryLabel":"Smartphone","badge":"Precio Apple España","image":"https://bestshop.com.py/img/1000x1000/products/599090144/599090144-additional-iphone-17-black0-c.jpg","alt":"Apple iPhone 17 negro, vistas frontal y trasera","description":"Pantalla Super Retina XDR de 6,3 pulgadas con ProMotion, chip A19 y sistema de cámara dual Fusion de 48 Mpx.","specs":["256 GB de almacenamiento","Pantalla OLED de 6,3 pulgadas","Chip A19"],"source":"Apple España","sourceUrl":"https://www.apple.com/es/shop/buy-iphone/iphone-17/pantalla-de-6%2C3%E2%80%B3-256gb-negro","video":"H3KnMyojEQU","start":1783,"videoLabel":"Apple Event · Presentación del iPhone 17","variants":["Negro","Azul neblina","Lavanda","Blanco","Verde salvia"],"imageCredit":"BestShop · fotografía de producto"},{"id":"galaxys26","name":"Samsung Galaxy S26 Ultra","variant":"512 GB · 12 GB RAM","price":1319,"category":"moviles","categoryLabel":"Smartphone","badge":"Oferta Samsung España","image":"https://www.stephanis.com.cy/media/products/SAM.00764_1.jpg?dimensions=1000x1000","alt":"Samsung Galaxy S26 Ultra negro, frontal y trasera con S Pen","description":"Pantalla Dynamic AMOLED 2X de 6,9 pulgadas, cámara principal de 200 Mpx, S Pen integrado y procesador Snapdragon 8 Elite Gen 5 para Galaxy.","specs":["512 GB de almacenamiento","12 GB de RAM","Pantalla de 6,9 pulgadas"],"source":"Samsung España","sourceUrl":"https://www.samsung.com/es/smartphones/galaxy-s26-ultra/buy/?modelCode=SM-S948BZKGEUB","video":"0vSOR31j3uc","videoLabel":"Presentación oficial de Samsung España","variants":["Negro","Azul cielo","Violeta","Blanco"],"imageCredit":"Stephanis · fotografía de producto"},{"id":"buds4pro","name":"Samsung Galaxy Buds4 Pro","variant":"Auriculares inalámbricos","price":199,"category":"audio","categoryLabel":"Audio","badge":"Precio Samsung España","image":"https://media.ldlc.com/r1600/ld/products/00/06/32/30/LD0006323019.jpg","alt":"Samsung Galaxy Buds4 Pro blancos con estuche de carga","description":"Auriculares inalámbricos con audio Hi-Fi, cancelación activa de ruido y estuche de carga.","specs":["Audio Hi-Fi de alta resolución","Cancelación activa de ruido","Estuche de carga"],"source":"Samsung España","sourceUrl":"https://www.samsung.com/es/audio-sound/galaxy-buds4-pro/buy/","video":"iGzVKI8OMjE","videoLabel":"Presentación oficial de Samsung España","variants":["Blanco","Negro"],"imageCredit":"LDLC · fotografía de producto"},{"id":"jbl770","name":"JBL Tune 770NC","variant":"Auriculares de diadema","price":94.99,"category":"audio","categoryLabel":"Audio","badge":"Precio JBL España","image":"https://www.jbl.es/dw/image/v2/BFND_PRD/on/demandware.static/-/Sites-masterCatalog_Harman/default/dwdcaaf7a3/JBL_TUNE_770NC_FOLD_REGULAR_BLACK_41791_x1.png?sh=680&sw=680","alt":"Auriculares inalámbricos JBL Tune 770NC negros","description":"Auriculares circumaurales con cancelación de ruido adaptativa, sonido JBL Pure Bass y hasta 70 horas de batería según JBL.","specs":["Bluetooth 5.3","Cancelación de ruido adaptativa","Hasta 70 horas de batería"],"source":"JBL España","sourceUrl":"https://www.jbl.es/TUNE770NC.html","video":null,"videoPage":true,"videoLabel":"Vídeo de producto en la web de JBL","variants":["Negro"],"imageCredit":"JBL · fotografía oficial"},{"id":"xiaomipower","name":"Xiaomi Power Bank 10000 mAh 22,5 W Lite","variant":"Gris · 10.000 mAh","price":14.99,"category":"carga","categoryLabel":"Accesorio","badge":"Precio Xiaomi España","image":"https://www.ktronix.com/medias/6941812758663-001-750Wx750H?context=bWFzdGVyfGltYWdlc3wyMzg2fGltYWdlL3dlYnB8YURFeUwyaG1NeTh4TlRFeU5ETTJNRFl5TmpJd05pODJPVFF4T0RFeU56VTROall6WHpBd01WODNOVEJYZURjMU1FZ3w2NGU0MzBjZTQyZjc3Mjc4Mzk2MmQzYzgzNTI0NmFjYWQ2MDc2Zjc3ZGMwYTQ3NWUwMWE5NGUxYjIyMDEzZTI1","alt":"Batería externa Xiaomi Power Bank 10000 mAh 22,5 W Lite gris","description":"Batería externa de 10.000 mAh con carga rápida de hasta 22,5 W.","specs":["Capacidad de 10.000 mAh","Potencia de salida de hasta 22,5 W","Dos USB-A y un USB-C"],"source":"Xiaomi España","sourceUrl":"https://www.mi.com/es/product-list/accessories/","video":null,"videoPage":false,"videoLabel":"","variants":["Gris"],"imageCredit":"Ktronix · fotografía de producto"}]
function renderDeviceStore(){
 const grid=document.getElementById('device-grid');if(!grid)return;grid.textContent='';
 DEVICE_PRODUCTS.forEach(p=>{
  const card=document.createElement('article');card.className='device-card product-card';card.dataset.category=p.category;card.dataset.keywords=(p.name+' '+p.variant+' '+p.categoryLabel).toLocaleLowerCase('es');
  const photo=document.createElement('div');photo.className='product-photo';
  const img=document.createElement('img');img.src=p.image;img.alt=p.alt;img.loading='lazy';img.decoding='async';
  img.onerror=()=>{photo.textContent='';const fallback=document.createElement('div');fallback.className='product-photo-fallback';fallback.innerHTML='<i class="fa-solid fa-image"></i><span>Imagen no disponible</span>';photo.append(fallback)};
  photo.append(img);const credit=document.createElement('span');credit.className='product-photo-credit';credit.textContent='Foto: '+(p.imageCredit||p.source);photo.append(credit);
  const body=document.createElement('div');body.className='p-4 flex flex-col flex-1';
  const line=document.createElement('div');line.className='flex items-center justify-between gap-2';
  const cat=document.createElement('span');cat.className='eyebrow';cat.textContent=p.categoryLabel;
  const badge=document.createElement('span');badge.className='product-tag';badge.textContent=p.badge;line.append(cat,badge);
  const title=document.createElement('h2');title.className='font-black text-lg text-slate-900 mt-2';title.textContent=p.name;
  const sub=document.createElement('p');sub.className='text-xs muted mt-1';sub.textContent=p.variant;
  const desc=document.createElement('p');desc.className='text-xs muted leading-relaxed mt-3';desc.textContent=p.description;
  const priceWrap=document.createElement('div');priceWrap.className='mt-4';
  const priceLabel=document.createElement('p');priceLabel.className='text-[10px] text-slate-500';priceLabel.textContent='Precio de referencia';
  const price=document.createElement('p');price.className='product-price';price.textContent=euro(p.price);priceWrap.append(priceLabel,price);
  const label=document.createElement('label');label.className='field-label mt-3';label.textContent='Color';
  const select=document.createElement('select');select.className='form-field';select.id='device-variant-'+p.id;
  p.variants.forEach(v=>{const opt=document.createElement('option');opt.value=v;opt.textContent=v;select.append(opt)});label.append(select);
  const actions=document.createElement('div');actions.className='grid grid-cols-2 gap-2 mt-auto pt-4';
  const add=document.createElement('button');add.className='primary-button !px-2';add.type='button';add.innerHTML='<i class="fa-solid fa-basket-shopping"></i> Añadir';add.addEventListener('click',()=>addDeviceToCart(p.id));
  const detail=document.createElement('button');detail.className='secondary-button !px-2';detail.type='button';detail.innerHTML='<i class="fa-solid fa-circle-play"></i> Ver ficha';detail.addEventListener('click',()=>openDeviceMedia(p.id));actions.append(add,detail);
  const source=document.createElement('a');source.className='text-[10px] font-bold text-blue-700 underline mt-3';source.href=p.sourceUrl;source.target='_blank';source.rel='noopener noreferrer';source.textContent='Fuente del precio: '+p.source;
  body.append(line,title,sub,desc,priceWrap,label,actions,source);card.append(photo,body);grid.append(card);
 });
 filterDevices();
}
function addDeviceToCart(id){
 const p=DEVICE_PRODUCTS.find(x=>x.id===id);if(!p)return;
 const select=document.getElementById('device-variant-'+id),variant=select?select.value:p.variants[0];
 const name=p.name+' · '+p.variant+' · '+variant;
 const detail='Precio de referencia visto el 18/11/2026 en '+p.source+'. Precio final y disponibilidad por confirmar.';
 agregarAlCarrito(name,p.price,'producto',detail);
}
function openDeviceMedia(id){
 const p=DEVICE_PRODUCTS.find(x=>x.id===id);if(!p)return;
 const modal=document.getElementById('product-media-modal');if(!modal)return;
 document.getElementById('product-media-title').textContent=p.name;
 document.getElementById('product-media-variant').textContent=p.variant+' · '+euro(p.price);
 document.getElementById('product-media-image').src=p.image;document.getElementById('product-media-image').alt=p.alt;
 document.getElementById('product-media-description').textContent=p.description;
 const specs=document.getElementById('product-media-specs');specs.textContent='';
 p.specs.forEach(x=>{const li=document.createElement('li');li.textContent=x;specs.append(li)});
 const link=document.getElementById('product-media-source');link.href=p.sourceUrl;link.textContent='Consultar precio y producto en '+p.source;
 const frame=document.getElementById('product-video'),wrap=document.getElementById('product-video-wrap'),credit=document.getElementById('product-video-credit'),external=document.getElementById('product-video-external');
 frame.src='';wrap.classList.add('hidden');external.classList.add('hidden');
 if(p.video){frame.src='https://www.youtube-nocookie.com/embed/'+p.video+(p.start?'?start='+p.start:'');frame.title='Vídeo de '+p.name;credit.textContent=p.videoLabel;wrap.classList.remove('hidden')}
 else if(p.videoPage){external.href=p.sourceUrl;external.textContent='Ver vídeo del producto en JBL';external.classList.remove('hidden')}
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
function confirmDemoPurchase(){
 const items=demoItems();if(!items.length){toast('Añade un dispositivo o accesorio primero');return}
 if(items.some(x=>x.price===null)){toast('Hay productos sin precio: consulta antes de continuar');return}
 if(!document.getElementById('demo-accept').checked){toast('Confirma que has revisado el resumen');return}
 const delivery=safeText('demo-delivery'),total=items.reduce((sum,x)=>sum+x.price*x.qty,0);
 const order={id:'DEMO-'+new Date().getFullYear()+'-'+Math.random().toString(36).slice(2,8).toUpperCase(),date:new Date().toISOString(),delivery,total,items:items.map(x=>({...x}))};
 try{const saved=JSON.parse(localStorage.getItem('sanmaximo-demo-orders')||'[]');localStorage.setItem('sanmaximo-demo-orders',JSON.stringify([order,...(Array.isArray(saved)?saved:[])].slice(0,5)));localStorage.setItem('sanmaximo-demo-last-order',JSON.stringify(order))}catch(e){}
 cart=cart.filter(x=>x.type!=='producto');saveCart();renderCart();document.getElementById('demo-checkout-form').classList.add('hidden');document.getElementById('demo-success').classList.remove('hidden');
 document.getElementById('demo-order-id').textContent=order.id;document.getElementById('demo-order-date').textContent=new Date(order.date).toLocaleString('es-ES');document.getElementById('demo-order-delivery').textContent=delivery;document.getElementById('demo-order-total').textContent=euro(total);
 const receipt=document.getElementById('demo-receipt-lines');receipt.textContent='';items.forEach(x=>{const line=document.createElement('p');line.className='text-xs py-1';line.textContent=x.qty+' × '+x.name+' — '+euro(x.price*x.qty);receipt.append(line)});
 window.scrollTo({top:0,behavior:'smooth'});
}
function downloadDemoReceipt(){
 let order=null;try{order=JSON.parse(localStorage.getItem('sanmaximo-demo-last-order')||'null')}catch(e){}
 if(!order){toast('No hay recibo disponible');return}
 const lines=order.items.map(x=>x.qty+' × '+x.name+' — '+euro(x.price*x.qty)).join('\n');
 const content='SAN MÁXIMO TELECOM · RESUMEN DE COMPRA (SIMULACIÓN)\n\nCódigo: '+order.id+'\nFecha: '+new Date(order.date).toLocaleString('es-ES')+'\nModalidad: '+order.delivery+'\n\n'+lines+'\n\nTOTAL ORIENTATIVO: '+euro(order.total)+'\n\nEste documento es un resumen simulado. No acredita un pedido ni un pago y no se enviará ningún producto.';
 const blob=new Blob([content],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='resumen-compra-san-maximo.txt';a.click();URL.revokeObjectURL(url);
}
document.addEventListener('DOMContentLoaded',()=>{
 renderDeviceStore();updateDemoCheckout();
 const buy=document.getElementById('cart-buy-demo');if(buy)buy.addEventListener('click',proceedToCheckout);
 const confirm=document.getElementById('demo-confirm');if(confirm)confirm.addEventListener('click',confirmDemoPurchase);
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
