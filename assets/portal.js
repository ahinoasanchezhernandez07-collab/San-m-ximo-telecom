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
 if(!cart.length){const p=document.createElement('p');p.className='text-sm text-slate-500 text-center py-12';p.textContent='Todavía no has añadido nada. Explora tarifas o dispositivos y guárdalos aquí.';list.append(p);if(totalNode)totalNode.textContent='0,00 €';updateRequestPreview();return}
 let total=0;
 cart.forEach((item,index)=>{
  if(item.price!==null&&item.price!==undefined)total+=item.price*item.qty;
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
 if(totalNode)totalNode.textContent=euro(total);updateRequestPreview();
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
 const total=cart.reduce((sum,item)=>sum+(item.price!==null&&item.price!==undefined?item.price*item.qty:0),0);
 const sum=document.getElementById('request-monthly-total');if(sum)sum.textContent=euro(total)+'/mes (solo tarifas)';
}
function sendRequestEmail(event){
 event.preventDefault();const name=safeText('request-name'),email=safeText('request-email'),message=safeText('request-message'),dest=safeText('request-destination')||GENERAL_EMAIL;
 if(!name||!email||!message){toast('Completa nombre, correo y consulta');return}
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){toast('Revisa el correo electrónico');return}
 const lines=cart.length?cart.map(x=>'- '+x.qty+' × '+x.name+' | '+(x.price===null?'Precio por confirmar':euro(x.price)+(x.type==='tarifa'?'/mes':''))+' | '+(x.detail||'')).join('\n'):'No hay productos añadidos al carrito.';
 const total=cart.reduce((sum,x)=>sum+(x.price!==null&&x.price!==undefined?x.price*x.qty:0),0);
 const subject='Solicitud desde la web de San Máximo Telecom';
 const body='Hola, me gustaría recibir información.\n\nNombre: '+name+'\nCorreo para responderme: '+email+'\n\nConsulta:\n'+message+'\n\nMi selección:\n'+lines+'\n\nCuota mensual inicial estimada (solo tarifas): '+euro(total)+'/mes.\n\nEntiendo que esta solicitud no es una contratación ni un pago. Quedo pendiente de confirmar disponibilidad y condiciones.';
 const safeDest=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dest)?dest:GENERAL_EMAIL;const url='mailto:'+safeDest+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
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
 if(has('carrito','cesta','solicitud','mi compra')){openCart();return ['He abierto tu cesta. Puedes revisar los artículos, hacer una compra de prueba o consultar con el equipo.',''];}
 if(has('compra de prueba','simular compra','compra simulada'))return ['Puedes probar la compra con los dispositivos de tu cesta. Es una simulación local: no se cobra ni se envía nada.',['compra-demo.html','Ir a la compra de prueba']];
 if(has('comprar','contratar','quiero una tarifa')&&!has('movil','smartphone','tablet','auricular','reloj','accesorio','iphone','samsung'))return ['Te acompaño paso a paso: primero elige una tarifa o un producto, añádelo a tu solicitud y después contacta con el equipo para confirmar cobertura, stock y condiciones.',['tarifas.html','Empezar a elegir']];
 if(has('movil','smartphone','tablet','auricular','reloj','accesorio','iphone','samsung','bateria externa','power bank'))return ['En Dispositivos tienes productos con fotografías, precios de referencia y vídeos de presentación cuando están disponibles. Puedes añadirlos a la cesta y probar una compra simulada.',['dispositivos.html','Ver dispositivos']];
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
 const params=new URLSearchParams(location.search),requestMessage=document.getElementById('request-message');if(requestMessage&&!requestMessage.value.trim()){const type=params.get('tipo');if(params.get('origen')==='carrito')requestMessage.value='Me gustaría recibir información sobre los productos y tarifas que he añadido a mi solicitud. Por favor, confirmad disponibilidad, cobertura y condiciones.';else if(type==='empresa')requestMessage.value='Me gustaría solicitar información sobre soluciones de conectividad y telecomunicaciones para mi empresa.';else if(type==='energia')requestMessage.value='Me gustaría recibir asesoramiento sobre una oferta de luz o gas.';else if(type==='factura')requestMessage.value='Me gustaría recibir ayuda para revisar mi factura y comparar alternativas.'}
}
document.addEventListener('DOMContentLoaded',initPortal);

const DEVICE_PRODUCTS=[{"id":"iphone17","name":"Apple iPhone 17","variant":"256 GB","price":1109,"category":"moviles","categoryLabel":"Smartphone","badge":"Precio Apple España","image":"https://bestshop.com.py/img/1000x1000/products/599090144/599090144-additional-iphone-17-black0-c.jpg","alt":"Apple iPhone 17 negro, vistas frontal y trasera","description":"Pantalla Super Retina XDR de 6,3 pulgadas con ProMotion, chip A19 y sistema de cámara dual Fusion de 48 Mpx.","specs":["256 GB de almacenamiento","Pantalla OLED de 6,3 pulgadas","Chip A19"],"source":"Apple España","sourceUrl":"https://www.apple.com/es/shop/buy-iphone/iphone-17/pantalla-de-6%2C3%E2%80%B3-256gb-negro","video":"H3KnMyojEQU","start":1783,"videoLabel":"Apple Event · Presentación del iPhone 17","variants":["Negro","Azul neblina","Lavanda","Blanco","Verde salvia"]},{"id":"galaxys26","name":"Samsung Galaxy S26 Ultra","variant":"512 GB · 12 GB RAM","price":1399,"category":"moviles","categoryLabel":"Smartphone","badge":"Oferta Samsung España","image":"https://www.stephanis.com.cy/media/products/SAM.00764_1.jpg?dimensions=1000x1000","alt":"Samsung Galaxy S26 Ultra negro, frontal y trasera con S Pen","description":"Pantalla Dynamic AMOLED 2X de 6,9 pulgadas, cámara principal de 200 Mpx, S Pen integrado y procesador Snapdragon 8 Elite Gen 5 para Galaxy.","specs":["512 GB de almacenamiento","12 GB de RAM","Pantalla de 6,9 pulgadas"],"source":"Samsung España","sourceUrl":"https://www.samsung.com/es/smartphones/galaxy-s26-ultra/buy/?modelCode=SM-S948BZKGEUB","video":"0vSOR31j3uc","videoLabel":"Presentación oficial de Samsung España","variants":["Negro","Azul cielo","Violeta","Blanco"]},{"id":"buds4pro","name":"Samsung Galaxy Buds4 Pro","variant":"Auriculares inalámbricos","price":199,"category":"audio","categoryLabel":"Audio","badge":"Precio Samsung España","image":"https://media.ldlc.com/r1600/ld/products/00/06/32/30/LD0006323019.jpg","alt":"Samsung Galaxy Buds4 Pro blancos con estuche de carga","description":"Auriculares inalámbricos con audio Hi-Fi, cancelación activa de ruido y estuche de carga.","specs":["Audio Hi-Fi de alta resolución","Cancelación activa de ruido","Estuche de carga"],"source":"Samsung España","sourceUrl":"https://www.samsung.com/es/audio-sound/galaxy-buds4-pro/buy/","video":"iGzVKI8OMjE","videoLabel":"Presentación oficial de Samsung España","variants":["Blanco","Negro"]},{"id":"jbl770","name":"JBL Tune 770NC","variant":"Auriculares de diadema","price":94.99,"category":"audio","categoryLabel":"Audio","badge":"Precio JBL España","image":"https://www.jbl.es/dw/image/v2/BFND_PRD/on/demandware.static/-/Sites-masterCatalog_Harman/default/dwdcaaf7a3/JBL_TUNE_770NC_FOLD_REGULAR_BLACK_41791_x1.png?sh=680&sw=680","alt":"Auriculares inalámbricos JBL Tune 770NC negros","description":"Auriculares circumaurales con cancelación de ruido adaptativa, sonido JBL Pure Bass y hasta 70 horas de batería según JBL.","specs":["Bluetooth 5.3","Cancelación de ruido adaptativa","Hasta 70 horas de batería"],"source":"JBL España","sourceUrl":"https://www.jbl.es/TUNE770NC.html","video":null,"videoPage":true,"videoLabel":"Vídeo de producto en la web de JBL","variants":["Negro"]},{"id":"xiaomipower","name":"Xiaomi Power Bank 10000 mAh 22,5 W Lite","variant":"Gris · 10.000 mAh","price":14.99,"category":"carga","categoryLabel":"Accesorio","badge":"Precio Xiaomi España","image":"https://www.ktronix.com/medias/6941812758663-001-750Wx750H?context=bWFzdGVyfGltYWdlc3wyMzg2fGltYWdlL3dlYnB8YURFeUwyaG1NeTh4TlRFeU5ETTJNRFl5TmpJd05pODJPVFF4T0RFeU56VTROall6WHpBd01WODNOVEJYZURjMU1FZ3w2NGU0MzBjZTQyZjc3Mjc4Mzk2MmQzYzgzNTI0NmFjYWQ2MDc2Zjc3ZGMwYTQ3NWUwMWE5NGUxYjIyMDEzZTI1","alt":"Batería externa Xiaomi Power Bank 10000 mAh 22,5 W Lite gris","description":"Batería externa de 10.000 mAh con carga rápida de hasta 22,5 W.","specs":["Capacidad de 10.000 mAh","Potencia de salida de hasta 22,5 W","Dos USB-A y un USB-C"],"source":"Xiaomi España","sourceUrl":"https://www.mi.com/es/product-list/accessories/","video":null,"videoPage":false,"videoLabel":"","variants":["Gris"]}];
function renderDeviceStore(){
 const grid=document.getElementById('device-grid');if(!grid)return;grid.textContent='';
 DEVICE_PRODUCTS.forEach(p=>{
  const card=document.createElement('article');card.className='device-card product-card';card.dataset.category=p.category;card.dataset.keywords=(p.name+' '+p.variant+' '+p.categoryLabel).toLocaleLowerCase('es');
  const photo=document.createElement('div');photo.className='product-photo';
  const img=document.createElement('img');img.src=p.image;img.alt=p.alt;img.loading='lazy';img.decoding='async';
  img.onerror=()=>{photo.textContent='';const fallback=document.createElement('div');fallback.className='product-photo-fallback';fallback.innerHTML='<i class="fa-solid fa-image"></i><span>Imagen no disponible</span>';photo.append(fallback)};
  photo.append(img);
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
 if(!document.getElementById('demo-accept').checked){toast('Confirma que has entendido que es una simulación');return}
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
 const content='SAN MÁXIMO TELECOM · RECIBO DE DEMOSTRACIÓN\n\nCódigo: '+order.id+'\nFecha: '+new Date(order.date).toLocaleString('es-ES')+'\nModalidad: '+order.delivery+'\n\n'+lines+'\n\nTOTAL SIMULADO: '+euro(order.total)+'\n\nESTO NO ES UNA COMPRA REAL. No se ha realizado ningún pago, no existe un pedido y no se enviará ningún producto.';
 const blob=new Blob([content],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='recibo-demo-san-maximo.txt';a.click();URL.revokeObjectURL(url);
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
