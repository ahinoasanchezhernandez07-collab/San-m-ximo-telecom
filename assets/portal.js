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
function toast(message){const node=document.createElement('div');node.className='toast';node.textContent=message;document.body.append(node);setTimeout(()=>node.remove(),3200)}
function loadCart(){try{const value=JSON.parse(localStorage.getItem('sanmaximo-cart')||'[]');cart=Array.isArray(value)?value.filter(x=>x&&typeof x.name==='string'&&Number.isInteger(x.qty)&&x.qty>0):[]}catch(e){cart=[]}renderCart()}
function saveCart(){try{localStorage.setItem('sanmaximo-cart',JSON.stringify(cart))}catch(e){}}
function agregarAlCarrito(name,price=null,type='product',detail=''){const p=(price===null||price===undefined||price===''||!Number.isFinite(Number(price)))?null:Number(price);const found=cart.find(x=>x.name===name&&x.type===type);if(found)found.qty++;else cart.push({name:name,price:p,type:type,detail:detail||'',qty:1});saveCart();renderCart();openCart();toast('Añadido a tu solicitud: '+name)}
function renderCart(){
 const list=document.getElementById('cart-items'),badge=document.getElementById('cart-badge'),totalNode=document.getElementById('cart-total');if(!list)return;
 const count=cart.reduce((n,x)=>n+x.qty,0);if(badge)badge.textContent=count;
 list.textContent='';
 if(!cart.length){const p=document.createElement('p');p.className='text-sm text-slate-500 text-center py-12';p.textContent='Todavía no has añadido nada. Explora tarifas o dispositivos y guárdalos aquí.';list.append(p);if(totalNode)totalNode.textContent='0,00 €/mes';updateRequestPreview();return}
 let total=0;
 cart.forEach((item,index)=>{
  if(item.type==='tarifa'&&item.price!==null)total+=item.price*item.qty;
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
 if(totalNode)totalNode.textContent=euro(total)+'/mes';updateRequestPreview();
}
function changeQty(i,delta){if(!cart[i])return;cart[i].qty+=delta;if(cart[i].qty<=0)cart.splice(i,1);saveCart();renderCart()}
function removeCart(i){cart.splice(i,1);saveCart();renderCart();toast('Artículo eliminado')}
function openCart(){const el=document.getElementById('cart-overlay');if(el)el.classList.add('open')}
function closeCart(){const el=document.getElementById('cart-overlay');if(el)el.classList.remove('open')}
function toggleCarrito(){const el=document.getElementById('cart-overlay');if(el)el.classList.toggle('open')}
function proceedToContact(){if(!cart.length){toast('Añade primero una tarifa o producto');return}window.location.href='contacto.html?origen=carrito'}
function updateRequestPreview(){
 const el=document.getElementById('request-items-preview');if(!el)return;el.textContent='';
 if(!cart.length){el.textContent='No hay artículos guardados en tu solicitud.';return}
 cart.forEach(item=>{const p=document.createElement('p');p.className='text-xs py-2 border-b border-slate-200';p.textContent=item.qty+' × '+item.name+' — '+(item.price===null?'Precio por confirmar':euro(item.price)+(item.type==='tarifa'?'/mes':''))+(item.detail?' · '+item.detail:'');el.append(p)});
 const total=cart.reduce((sum,item)=>sum+(item.type==='tarifa'&&item.price!==null?item.price*item.qty:0),0);
 const sum=document.getElementById('request-monthly-total');if(sum)sum.textContent=euro(total)+'/mes (solo tarifas)';
}
function sendRequestEmail(event){
 event.preventDefault();const name=safeText('request-name'),email=safeText('request-email'),message=safeText('request-message'),dest=safeText('request-destination')||GENERAL_EMAIL;
 if(!name||!email||!message){toast('Completa nombre, correo y consulta');return}
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){toast('Revisa el correo electrónico');return}
 const lines=cart.length?cart.map(x=>'- '+x.qty+' × '+x.name+' | '+(x.price===null?'Precio por confirmar':euro(x.price)+(x.type==='tarifa'?'/mes':''))+' | '+(x.detail||'')).join('\n'):'No hay productos añadidos al carrito.';
 const total=cart.reduce((sum,x)=>sum+(x.type==='tarifa'&&x.price!==null?x.price*x.qty:0),0);
 const subject='Solicitud desde la web de San Máximo Telecom';
 const body='Hola, me gustaría recibir información.\n\nNombre: '+name+'\nCorreo para responderme: '+email+'\n\nConsulta:\n'+message+'\n\nMi selección:\n'+lines+'\n\nCuota mensual inicial estimada (solo tarifas): '+euro(total)+'/mes.\n\nEntiendo que esta solicitud no es una contratación ni un pago. Quedo pendiente de confirmar disponibilidad y condiciones.';
 const url='mailto:'+encodeURIComponent(dest)+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
 window.location.href=url;
 const status=document.getElementById('request-status');if(status)status.textContent='Se ha preparado un correo en tu aplicación de email. Revísalo y pulsa Enviar para transmitir la solicitud.';
}
function openMobileMenu(){const el=document.getElementById('mobile-nav');if(el)el.classList.toggle('open')}
function toggleTheme(){document.body.classList.toggle('dark-mode');try{localStorage.setItem('sanmaximo-theme',document.body.classList.contains('dark-mode')?'dark':'light')}catch(e){}updateThemeButton()}
function updateThemeButton(){const dark=document.body.classList.contains('dark-mode'),icon=document.getElementById('theme-icon'),btn=document.getElementById('theme-toggle');if(icon)icon.className='fa-solid '+(dark?'fa-sun':'fa-moon');if(btn)btn.setAttribute('aria-label',dark?'Activar modo claro':'Activar modo oscuro')}
function addMessage(text,role,link){const box=document.getElementById('chat-messages');if(!box)return;const b=document.createElement('div');b.className='chat-bubble '+(role==='user'?'user':'bot');b.textContent=text;if(link){const a=document.createElement('a');a.href=link[0];a.className='block mt-2 font-extrabold text-blue-700 underline';a.textContent=link[1];b.append(a)}box.append(b);box.scrollTop=box.scrollHeight}
function toggleMaxi(){const panel=document.getElementById('maxi-chat');if(!panel)return;const opening=panel.classList.contains('hidden');panel.classList.toggle('hidden');if(opening){const input=document.getElementById('maxi-input');if(input)input.focus()}}
function presetMaxi(text){const input=document.getElementById('maxi-input');if(input)input.value=text;sendMaxi()}
function answerMaxi(raw){
 const q=raw.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 const has=(...words)=>words.some(x=>q.includes(x));
 if(has('carrito','cesta','solicitud','mi compra')){openCart();return ['He abierto tu solicitud. Desde ahí puedes revisar cantidades y continuar para preparar un correo con la selección.',''];}
 if(has('comprar','contratar','quiero una tarifa'))return ['Te acompaño paso a paso: primero elige una tarifa o un producto, añádelo a tu solicitud y después contacta con el equipo para confirmar cobertura, stock y condiciones.',['tarifas.html','Empezar a elegir']];
 if(has('movil','smartphone','tablet','auricular','reloj','accesorio','iphone','samsung'))return ['Para consultar móviles y accesorios, entra en la tienda de dispositivos. Puedes guardar lo que te interesa en tu solicitud.',['dispositivos.html','Ver dispositivos']];
 if(has('precio','tarifa','fibra','datos','gb','permanencia'))return ['En Tarifas puedes ver las opciones y comparar el coste de dos ofertas con promociones, precio posterior y alta. Los precios deben confirmarse antes de contratar.',['tarifas.html','Ver tarifas']];
 if(has('factura','recibo','ahorro','analizar'))return ['Puedes analizar localmente un PDF o imagen desde el apartado Facturas. El documento no se envía desde esta web y debes revisar el importe detectado.',['facturas.html','Analizar factura']];
 if(has('luz','gas','energia','kwh','electricidad'))return ['En Energía puedes calcular un subtotal y comparar dos ofertas introduciendo los datos de tus facturas.',['energia.html','Ir a Energía']];
 if(has('tienda','direccion','ubicacion','mapa','donde'))return ['En Tiendas tienes el mapa interactivo y los correos de cada establecimiento.',['tiendas.html','Ver tiendas']];
 if(has('persona','asesor','contactar','contacto','correo','email','hablar con alguien'))return ['Te llevo a Contacto. Allí puedes elegir el correo del equipo o de una tienda y enviar tu consulta.',['contacto.html','Contactar con el equipo']];
 if(has('cita','visita','reservar'))return ['En Contacto puedes preparar una consulta para la tienda. La hora no queda reservada hasta que la tienda la confirme.',['contacto.html#cita','Preparar visita']];
 if(has('hola','buenas','buenos dias','buenas tardes'))return ['¡Hola! Soy Maxi. Puedo ayudarte a elegir una tarifa, consultar dispositivos, revisar una factura, localizar una tienda o preparar una solicitud. ¿Por dónde empezamos?',''];
 if(has('gracias','perfecto'))return ['¡De nada! Estoy aquí para ayudarte con la web de San Máximo Telecom.',''];
 return ['Puedo ayudarte con tarifas, móviles, facturas, luz y gas, tiendas, carrito o contacto. Prueba con una de esas opciones o usa los accesos rápidos de abajo.',''];
}
function sendMaxi(){const input=document.getElementById('maxi-input');if(!input)return;const value=input.value.trim();if(!value)return;input.value='';addMessage(value,'user');const result=answerMaxi(value);if(result[1]&&Array.isArray(result[1]))addMessage(result[0],'bot',result[1]);else addMessage(result[0],'bot');}
function filterDevices(){const q=(safeText('device-search')||'').toLocaleLowerCase('es'),category=safeText('device-filter')||'all';let count=0;document.querySelectorAll('.device-card').forEach(card=>{const okCat=category==='all'||card.dataset.category===category;const okText=!q||(card.dataset.keywords+' '+card.innerText).toLocaleLowerCase('es').includes(q);card.style.display=okCat&&okText?'block':'none';if(okCat&&okText)count++});const empty=document.getElementById('device-empty');if(empty)empty.classList.toggle('hidden',count!==0)}
function updateStoreMap(){const select=document.getElementById('store-map-select');if(!select)return;const address=select.value,encoded=encodeURIComponent(address);const frame=document.getElementById('store-map-frame'),link=document.getElementById('store-map-link');if(frame)frame.src='https://maps.google.com/maps?q='+encoded+'&output=embed';if(link)link.href='https://www.google.com/maps/search/?api=1&query='+encoded}
function makeCalendarReminder(){const d=safeText('visit-date'),t=safeText('visit-time');if(!d||!t){toast('Elige fecha y hora');return}const start=new Date(d+'T'+t+':00');if(Number.isNaN(start.getTime())||start<new Date()){toast('Elige una fecha y hora futuras');return}const end=new Date(start.getTime()+30*60000),stamp=x=>x.getFullYear()+String(x.getMonth()+1).padStart(2,'0')+String(x.getDate()).padStart(2,'0')+'T'+String(x.getHours()).padStart(2,'0')+String(x.getMinutes()).padStart(2,'0')+'00';const store=safeText('visit-store'),reason=safeText('visit-reason');const content=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//San Maximo Telecom//Recordatorio//ES','BEGIN:VEVENT','UID:'+Date.now()+'@sanmaximo.local','DTSTAMP:'+stamp(new Date()),'DTSTART:'+stamp(start),'DTEND:'+stamp(end),'SUMMARY:Recordatorio de visita San Máximo Telecom','LOCATION:'+store.replace(/,/g,'\\,'),'DESCRIPTION:Recordatorio personal. La tienda debe confirmar la hora. Motivo: '+reason,'END:VEVENT','END:VCALENDAR'].join('\r\n');const blob=new Blob([content],{type:'text/calendar;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='recordatorio-san-maximo.ics';a.click();URL.revokeObjectURL(url);const status=document.getElementById('visit-status');if(status)status.textContent='Recordatorio descargado. La visita no está reservada: contacta con la tienda para confirmar.'}
function initPortal(){
 try{if(localStorage.getItem('sanmaximo-theme')==='dark')document.body.classList.add('dark-mode')}catch(e){}
 updateThemeButton();loadCart();
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
 const quick=document.getElementById('request-from-cart');if(quick&&new URLSearchParams(location.search).get('origen')==='carrito'){const note=document.getElementById('request-intro');if(note)note.textContent='Hemos recuperado tu selección. Completa la consulta y se preparará un correo para el equipo.'}
}
document.addEventListener('DOMContentLoaded',initPortal);