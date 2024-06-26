import './maps.css'
import './style.css'

function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
     
    center: {lat: 27.578701428161988,  lng: 77.69126094321724},
    zoom: 16, 
    mapId: "36696faeb54e073b",
    gestureHandling: "greedy",
  });

 //location service
 var infoWindow = new google.maps.InfoWindow();
 if (navigator.geolocation) {
     navigator.geolocation.watchPosition(function (position) 
     
     {
      //enableHighAccuracy	= true;
      setInterval(()=>{
        
         
      var pos = {
             lat: position.coords.latitude,
             lng: position.coords.longitude
         };
      
       
         const svgMarker = {
             path: "M17.659,9.597h-1.224c-0.199-3.235-2.797-5.833-6.032-6.033V2.341c0-0.222-0.182-0.403-0.403-0.403S9.597,2.119,9.597,2.341v1.223c-3.235,0.2-5.833,2.798-6.033,6.033H2.341c-0.222,0-0.403,0.182-0.403,0.403s0.182,0.403,0.403,0.403h1.223c0.2,3.235,2.798,5.833,6.033,6.032v1.224c0,0.222,0.182,0.403,0.403,0.403s0.403-0.182,0.403-0.403v-1.224c3.235-0.199,5.833-2.797,6.032-6.032h1.224c0.222,0,0.403-0.182,0.403-0.403S17.881,9.597,17.659,9.597 M14.435,10.403h1.193c-0.198,2.791-2.434,5.026-5.225,5.225v-1.193c0-0.222-0.182-0.403-0.403-0.403s-0.403,0.182-0.403,0.403v1.193c-2.792-0.198-5.027-2.434-5.224-5.225h1.193c0.222,0,0.403-0.182,0.403-0.403S5.787,9.597,5.565,9.597H4.373C4.57,6.805,6.805,4.57,9.597,4.373v1.193c0,0.222,0.182,0.403,0.403,0.403s0.403-0.182,0.403-0.403V4.373c2.791,0.197,5.026,2.433,5.225,5.224h-1.193c-0.222,0-0.403,0.182-0.403,0.403S14.213,10.403,14.435,10.403",
             fillColor: "white",
             fillOpacity: 100,
             strokeColor:"blue",
             strokeWeight: 1,
             rotation: 0,
             scale: 2,
             anchor: new google.maps.Point(0, 20),
           };
 
         var myLocation = new google.maps.Marker({
             position: pos,
             map: map,
             icon: svgMarker,
             draggable: true,
         });
        
         //myLocation.setPosition(( new google.maps.LatLng(pos) ));
         
         myLocation.addListener("click",()=>{map.setZoom(17);map.setCenter(pos);})
     
           setTimeout(()=>{myLocation.setMap(null)},500);  
         },3000);                
        
         },
             
     
     function () {
         handleLocationError(true, infoWindow, map.getCenter());
     },{maximumAge:3000, timeout:3000, enableHighAccuracy: true});
 } else {
     // Browser doesn't support Geolocation
     handleLocationError(false, infoWindow, map.getCenter());
 }


 
buildMarkers(vrindavan);
buildMarkers(mayapur);
buildMarkers(jagannath);
function buildMarkers(position) {
  const overlay = document.getElementById('overlay');
  const infoLink = document.getElementById('info');
  const c6Link = document.getElementById('c6');
  const name = document.getElementById('name');

  function smoothZoom(map, max, cnt = map.getZoom()) {
    if (cnt >= max) {
      return;
    } else {
      let z = google.maps.event.addListener(map, 'zoom_changed', function(event) {
        google.maps.event.removeListener(z);
        smoothZoom(map, max, cnt + 1);
      });
      requestAnimationFrame(function() {
        map.setZoom(cnt);
      }, 140); // 120ms is what I found to work well on my system -- it might not work well on all systems
    }
  }

  position.forEach((location) => {
  
    const priceTag = document.createElement('div');
    const box = document.createElement('figure');
    const image = document.createElement('img');
    const caption = document.createElement('figcaption');

    caption.className = 'placeTag';
    caption.textContent = location.lab;

    //box.appendChild(image);
    box.appendChild(caption);
    box.className = 'icon-tag';
    image.src = 'landmark.svg';
    image.alt="temple";

    priceTag.className = 'icon-tag';

    var marker1 = new google.maps.Marker({
      position: location,
      map: map,
       });

       marker1.addListener('click', function on() {
        map.setCenter(location);
        smoothZoom(map, map.getZoom() + 40 / map.getZoom());
        infoLink.href = location.urlid;
        c6Link.href = location.ginfo;
  
        if (location.urlid !== '#') {
          overlay.style.display = 'block';
        } else {
          overlay.style.display = 'none';
        }
  
        name.innerHTML = location.lab;
      });
  

    const marker = new google.maps.marker.AdvancedMarkerView({
      map,
      position: location,
      content: box,
      zIndex: location.ind,
      //collisionBehavior: google.maps.CollisionBehavior.REQUIRED_AND_HIDES_OPTIONAL,
      collisionBehavior: google.maps.CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY,
    });
   
/*
    map.addListener('zoom_changed', () => {
      const zoom = map.getZoom();

      if (zoom) {
        // Only show each marker above a certain zoom level.
        marker.map = zoom > location.zLevel ? map : null;
      }
    }, { passive: true });

  */


   marker.addListener('click', function on() {
      map.setCenter(location);
      smoothZoom(map, map.getZoom() + 40 / map.getZoom());
      infoLink.href = location.urlid;
      c6Link.href = location.ginfo;

      if (location.urlid !== '#') {
        overlay.style.display = 'block';
      } else {
        overlay.style.display = 'none';
      }

      name.innerHTML = location.lab;
    });

    //map.setZoom(9);
  });

  map.addListener('click', () => {
    overlay.style.display = 'none';
  }, { passive: true });
}


}


var vrindavan = [
    { lat:27.571202154707226,lng: 77.67928295991219,lab: "VRINDAVAN",ind:35, zLevel:1,urlid: "#",ginfo: "https://goo.gl/maps/333N912ojaqiixdi6",icon:"krishna.svg",},
    {lat: 27.580128614542744,lng: 77.68760644196654,lab: "SRI SRI RADHA MADAN MOHAN TEMPLE",ind:25, zLevel:12, urlid: "https://www.dhama.co.in/vraj-places/madan-mohan-temple", ginfo: "https://goo.gl/maps/j8YwA2cgGCebtWYQ6",icon:"krishna.svg", }, 
    {lat: 27.58374820631136,lng: 77.69568885895697,lab: "SRI SRI RADHA DAMODAR TEMPLE",ind:25, zLevel:12,urlid: "https://www.dhama.co.in/vraj-places/radha-damodar-temple",ginfo: "https://goo.gl/maps/dKQiNSsxtMd2TBAK6",icon:"krishna.svg",}, 
    {lat: 27.582715301238412,lng: 77.69620222463998,lab: "SRI SRI RADHA SHYAMSUNDAR TEMPLE",ind:25, zLevel:12,urlid: "https://www.dhama.co.in/vraj-places/radha-shyam-sundar-temple", ginfo: "https://goo.gl/maps/r3woixYDQML7KUVdA",icon:"krishna.svg", }, 
    {lat: 27.585258025882432,lng: 77.69868663018347,lab: "SRI SRI RADHA RAMAN TEMPLE",ind:25, zLevel:12,urlid: "https://www.dhama.co.in/vraj-places/radha-raman-temple",ginfo: "https://goo.gl/maps/NJBEXMu4hAnCRr3TA",icon:"krishna.svg", }, 
    {lat: 27.586035209022143,lng: 77.69859155898293,lab: "SRI SRI RADHA GOKULANANDA TEMPLE",ind:25, zLevel:12,urlid: "https://www.dhama.co.in/vraj-places/radha-gokulnanda-temple",ginfo: "https://goo.gl/maps/2CbRveVW6Vc4fnHdA",icon:"krishna.svg",}, 
    {lat: 27.585857813030835,lng: 77.69942530614654,lab: "SRI SRI RADHA GOPINATH TEMPLE",ind:25, zLevel:12,urlid: "https://www.dhama.co.in/vraj-places/radha-gopinath-temple",ginfo: "https://goo.gl/maps/xTmgQcAm8b5SzoZk6",icon:"krishna.svg",}, 
    {lat: 27.58013236441595,lng: 77.70174113620575,lab: "SRI SRI RADHA GOVINDA DEV TEMPLE",ind:25, zLevel:12,urlid: "https://www.dhama.co.in/vraj-places/radha-govinda-dev",ginfo: "https://goo.gl/maps/XX8tdB6w2HAUzvAE6",icon:"krishna.svg",}, 
    {lat: 27.58533423351285,lng: 77.6986426577777,lab: "SRILA GOPAL BHATTA GOSWAMI SAMADHI",ind:25, zLevel:18,urlid: "https://www.radha.name/holy-places-gallery/uttar-pradesh-vraja/vraja-vrindavan/vrindavan/gopal-bhatta-goswami-samadhi",ginfo: "https://goo.gl/maps/YAaiGABtGNXWYRR98",icon:"krishna.svg",}, 
    {lat: 27.582429246876387,lng: 77.69440998754698,lab: "SEVA KUNJ",ind:25, zLevel:18,urlid: "#",ginfo: "https://goo.gl/maps/co4pMT8e2Bavqoma6",icon:"krishna.svg",}, 
    {lat: 27.582289324519838,lng: 77.69578446361275,lab: "KISHORI KUNJA",ind:25, zLevel:18,urlid: "#",ginfo: "https://goo.gl/maps/hwCMH25pasRz3kUMA",icon:"krishna.svg",}, 
    {lat: 27.58281490266378,lng: 77.69478956215494,lab: "PAURNAMASI MANDIR",ind:25, zLevel:18,urlid: "https://www.brajrasik.org/articles/60413b59f8ad1f0008b07059/shri-paurnamasi-devi-yogmaya-temple-vrindavan",ginfo: "https://goo.gl/maps/txX6yj5hAjpxYEDs5",icon:"krishna.svg",}, 
    {lat: 27.58111510448806,lng: 77.69542590793466,lab: "MUTARI GUPTA GAUR NITAI",ind:25, zLevel:18,urlid: "#",ginfo: "https://goo.gl/maps/1jA6aGFQPLvCX4cV8",icon:"krishna.svg",}, 
    {lat: 27.58095907311774,lng: 77.69551854343074,lab: "BAN KHANDI MAHADEVA",ind:25, zLevel:12,urlid: "https://www.brajrasik.org/media/bankhandi-mahadev-vrindavan",ginfo: "https://goo.gl/maps/MAWMAmHbTxasSxmUA",icon:"krishna.svg",}, 
    {lat: 27.580799725304548,lng: 77.69140698908805,lab: "SRI SRI RADHA VALLABHA TEMPLE",ind:25, zLevel:18,urlid: "https://dhama108.blogspot.com/p/sri-sri-radha-vallabha-temple.html", ginfo: "https://goo.gl/maps/Mgefg2vdTWkLs2yWA",icon:"krishna.svg", }, 
    {lat: 27.58097689548589,lng: 77.69239091348027,lab: "SRI SRI NRSIMHA DEVA TEMPLE",ind:25, zLevel:15,urlid: "#",ginfo: "https://goo.gl/maps/DQJ1u59tfopA2aFv9",icon:"krishna.svg",}, 
    //BHATTA JI TEMPLE/ MADANMOHAN TEMPLE NEAR RADHA VALLABH TEMPLE IS STILL MISSING
    {lat: 27.583395199879117,lng: 77.69417014473805,lab: "IMALI TALA TEMPLE",ind:25, zLevel:18,urlid: "https://www.radha.name/holy-places-gallery/uttar-pradesh-vraja/vraja-vrindavan/vrindavan/imli-tala-temple",ginfo: "https://goo.gl/maps/kjWK8ThwCvho9Ah66",icon:"krishna.svg",}, 
    {lat: 27.584960646731812,lng: 77.69576130635593,lab: "JHADU MANDALA",ind:25, zLevel:18,urlid: "#",ginfo: "https://goo.gl/maps/HCyJJGMorvjKFHc76",icon:"krishna.svg",}, 
    {lat: 27.584169182122235,lng: 77.69491747902786,lab: "SRINGAR-VAT",ind:25, zLevel:18,urlid: "https://brajrasik.org/articles/589904ee8b03045e30966116/shringar-vat-vrindavan",ginfo: "https://goo.gl/maps/Lm8jtVC8hq2G85MA7",icon:"krishna.svg",}, 
    {lat: 27.58506424127671,lng: 77.70305042184977,lab: "GOPESHVAR MAHADEVA",ind:25, zLevel:18,urlid: "https://www.brijwale.com/gopeshwar-mahadev-ji-temple/",ginfo: "https://goo.gl/maps/R4jmF2thX5VQxUhQ6",icon:"krishna.svg",}, 
    //GOVindA GHAT STILL MISING
    {lat: 27.58551611445541,lng: 77.6965033509943,lab: "CHIR-GHAT",ind:25, zLevel:14,urlid: "https://www.brajrasik.org/media/chir-ghat-or-cheer-ghat-vrindavan",ginfo: "https://goo.gl/maps/VoLY1yGhRkbeQwv17",icon:"krishna.svg",},
    {lat: 27.58409461636287,lng: 77.69701644738002,lab: "MIRABAI TEMPLE",ind:25, zLevel:18,urlid: "https://www.brajrasik.org/media/mirabai-temple-vrindavan",ginfo: "https://goo.gl/maps/GNX4NYAiJPBAs4XJA",icon:"krishna.svg",}, 
    {lat: 27.584753822696502,lng: 77.69698916780118,lab: "SHAH JI TEMPLE",ind:25, zLevel:18,urlid: "#",ginfo: "https://goo.gl/maps/RT9A5sP9w95uuA3G6",icon:"krishna.svg",}, 
    //SADBHUJA TEMPLE
    {lat: 27.58404388962134,lng: 77.69820834887345,lab: "NIDHIVAN",ind:25, zLevel:18,urlid: "#",ginfo: "https://goo.gl/maps/Ra7Gf8w8oUB7QzWd7",icon:"krishna.svg",}, 
    {lat: 27.584003821173617,lng: 77.69956787520589,lab: "SONAR GAURANGA TEMPLE",ind:25, zLevel:18,urlid: "#", ginfo: "https://goo.gl/maps/vm7CRsjTyoz3gY9f9",icon:"krishna.svg",}, 
    {lat: 27.583876378523406,lng: 77.70030153846625,lab: "BILVAMANGAL THAKUR SAMADHI",ind:25, zLevel:18,urlid: "#",ginfo: "https://goo.gl/maps/yrGZ3EL6REaRKttU9",icon:"krishna.svg",}, 
    {lat: 27.582582148499434,lng: 77.7003728966874,lab: "AMIYA-NIMAI TEMPLE",ind:25, zLevel:18,urlid: "#",ginfo: "https://goo.gl/maps/gHczFiCVKCXgumz97",icon:"krishna.svg",}, 
    {lat: 27.583422072354676,lng: 77.70147037779171,lab: "BRAHMA KUNDA",ind:25, zLevel:18,urlid: "#",ginfo: "https://goo.gl/maps/7jdvAfXe3ukV3Vf57",icon:"krishna.svg",}, 
    {lat: 27.58231187556171,lng: 77.70262521491374,lab: "RANGA JI TEMPLE",ind:25, zLevel:18,urlid: "#",ginfo: "https://goo.gl/maps/FU9toKkGVhUXfFyM9",icon:"krishna.svg",}, 
    { lat: 27.580978958908958, lng: 77.70136739827507, lab: "64 SAMADHI AREA", ind:25, zLevel:18, urlid: "https://www.brajrasik.org/articles/5fcbd8e3b53a500008a9d9a7/64-samadhis-shri-chaushatt-mahant-samadhi-mandir-pastimes-vrindavan", ginfo: "https://goo.gl/maps/imfP37ZFhBsL6sEF9", icon:"krishna.svg", },
    { lat: 27.583653219205104, lng: 77.70296685178052, lab: "LAL BABU TEMPLE", ind:25, zLevel:18, urlid: "#", ginfo: "https://goo.gl/maps/2PHNuyWF9tQXLJ2x7", icon:"krishna.svg", }, 
    //SRINIVAS-KUNJ 
    { lat: 27.585933495543742, lng: 77.69649104901693, lab: "DHIRA-SAMEER", ind:25, zLevel:18, urlid: "https://brajrasik.org/articles/5a5d0e9e82274812fecf965b/dhira-samira-vrindavan", ginfo: "https://goo.gl/maps/V63ejDWJPMiexAaQ9", icon:"krishna.svg", }, 
    { lat: 27.58595651883918, lng: 77.70276392478263, lab: "SRI SRI RADHA RADHA KANTA TEMPLE", ind:25, zLevel:18, urlid: "http://krishnaplanet.com/radhakanta-temple-vrindavana", ginfo: "https://goo.gl/maps/Wza3xCsxu9PtTaERA", icon:"krishna.svg", }, 
    { lat: 27.58620993426866, lng: 77.70340437135215, lab: "VAMSI VAT TEMPLE", ind:25, zLevel:18, urlid: "https://brajrasik.org/articles/5876301258f4ac271a08b941/banshi-vat-or-vamshi-vata-vrindavan", ginfo: "https://goo.gl/maps/izQvJSNBHb7ZBtkc7", icon:"krishna.svg", },
    { lat: 27.58629232088121, lng: 77.69827587476668, lab: "VAMSI-GOPAL TEMPLE", ind:25, zLevel:18, urlid: "https://srilaprabhupadalila.org/read/5394", ginfo: "https://goo.gl/maps/i7RfUg23R5H5QhuU9", icon:"krishna.svg", },
    { lat: 27.584579911502118, lng: 77.70108293186895, lab: "GADADHAR DANT SAMADHI", ind:25, zLevel:18, urlid: "https://a108.net/blogs/entry/22550-gadadhar-pandit%E2%80%99s-danta-samadhi/", ginfo: "https://goo.gl/maps/TFPU42hHDEjZ8WnG7", icon:"krishna.svg", }, 
    { lat: 27.58686400728653, lng: 77.69826215335566, lab: "KESHI GHAT", ind:25, zLevel:18, urlid: "https://radhanathswamiyatras.com/yamuna/keshi-ghat/", ginfo: "https://goo.gl/maps/jNRJFvdddhGNTBNW7", icon:"krishna.svg", }, 
    // SUDAMA KUTIS 
    { lat: 27.58357241656314, lng: 77.70537373326347, lab: "SRI SRI RADHA BRAJ MOHAN", ind:25, zLevel:16, urlid: "https://www.brajrasik.org/articles/5e653bdaf8bd370061fc1241/shri-radha-madan-mohan-temple", ginfo: "https://goo.gl/maps/DshkDoaPEo1NdX4dA", icon:"krishna.svg", }, 
    { lat: 27.583838516641922, lng: 77.70649234466846, lab: "TEKARIRANI MANDIR", ind:25, zLevel:18, urlid: "https://www.radha.name/holy-places-gallery/uttar-pradesh-vraja/vraja-vrindavan/vrindavan/teka-rani-temple", ginfo: "https://goo.gl/maps/ra7F8WSM4eBF9T3R8", icon:"krishna.svg", }, 
    { lat: 27.5839797234295, lng: 77.70752062268144, lab: "JAGANNATH MANDIR", ind:25, zLevel:18, urlid: "https://www.radha.name/holy-places-gallery/uttar-pradesh-vraja/vraja-vrindavan/vrindavan/jaganath-ghat-temple", ginfo: "https://goo.gl/maps/kQJSZBpRPQoUWYJX9", icon:"krishna.svg", }, 
    { lat: 27.579269330969257, lng: 77.70465420859905, lab: "KATYAYANI SHAKTI PITH", ind:25, zLevel:18, urlid: "#", ginfo: "https://goo.gl/maps/eHD76LF6y75H3k8S8", icon:"krishna.svg", }, 
    { lat: 27.575598821638735, lng: 77.70694421278144, lab: "PANI GHAT", ind:25, zLevel:18, urlid: "#", ginfo: "https://goo.gl/maps/xZeEc5jFxUn9KRMu6", icon:"krishna.svg", }, 
    //RANGAJI GARDEN 
    { lat: 27.574493363434854, lng: 77.69934080431798, lab: "GOVINDA KUND", ind:25, zLevel:18, urlid: "https://dhama108.blogspot.com/p/govind-kund-vrindavan.html", ginfo: "https://goo.gl/maps/8oJ1sE7wKMdvRNHc6", icon:"krishna.svg", },
    //ADI BADRI GHAT 
    // RAJ-GHAT 
    { lat: 27.551619197386017, lng: 77.68529580367688, lab: "AKRUR JI TEMPLE", ind:25, zLevel:18, urlid: "https://www.brajrasik.org/articles/5e1a06bbe859b00061fbb244/akrur-ghat-vrindavan", ginfo: "https://goo.gl/maps/jp7HBMzR9L26nvWv7", icon:"krishna.svg", }, 
    { lat: 27.556013939668954, lng: 77.68759180789378, lab: "BHARTOD BIHARI", ind:25, zLevel:16, urlid: "https://dhama108.blogspot.com/p/akrur-ji-temple.html", ginfo: "https://goo.gl/maps/86JBHqJqPiuj1uZT6", icon:"krishna.svg", }, 
    { lat: 27.57072633113313, lng: 77.68597863228072, lab: "DAVANAL KUND", ind:25, zLevel:16, urlid: "https://dhama108.blogspot.com/p/davanal-kund.html", ginfo: "https://goo.gl/maps/GJt2oP1CtBiDRMSx9", icon:"krishna.svg", }, 
    //RADHA KUPA 
    { lat: 27.572727687347925, lng: 77.68003978363447, lab: "VRINDAVAN RESEARCH INSTITUTE", ind:25, zLevel:18, urlid: "#", ginfo: "https://goo.gl/maps/wmbk6W7XzUAQ1HFV7", icon:"krishna.svg", }, 
    { lat: 27.575994297858518, lng: 77.67559903120647, lab: "VARAHA GHAT TEMPLE", ind:25, zLevel:18, urlid: "#", ginfo: "https://goo.gl/maps/tzdHeVL2EfwRdFL86", icon:"krishna.svg", }, 
    { lat: 27.57673556037697, lng: 77.68016383560322, lab: "GO-GHAT", ind:25, zLevel:18, urlid: "#", ginfo: "https://goo.gl/maps/s43kZS5URbSbVhV38", icon:"krishna.svg", }, 
    { lat: 27.576176754362645, lng: 77.68011735323881, lab: "SAMADHIS OF SRILA PRABHUPADA DISCIPLES", ind:25, zLevel:18, urlid: "#", ginfo: "https://goo.gl/maps/yqfsn62AAj83kyUE8", icon:"krishna.svg", }, 
    { lat: 27.57642512658178, lng: 77.68042105916052, lab: "ISKCON GO-SHALA", ind:25, zLevel:18, urlid: "https://dhama108.blogspot.com/p/iskcon-go-shala.html", ginfo: "https://goo.gl/maps/AmDGtiVH6a9bPx5i6", icon:"krishna.svg", }, 
    
    
    
    { lat: 27.578432916962946, lng: 77.68468654822676, lab: "KALIYA GHAT", ind:25, zLevel:18, urlid: "https://www.brajrasik.org/articles/5d4a735daa7824006a8c3b66/kalideh-kaliya-ghat-vrindavan", ginfo: "https://goo.gl/maps/x7ZNkrqy9CqSUPEp8", icon:"krishna.svg", }, 
    { lat: 27.57776661581127, lng: 77.68497712961208, lab: "PRABHODANANDA SARASWATI SAMADHI", ind:25, zLevel:18, urlid: "https://brajrasik.org/articles/5e5251b2d3ae43006150f11f/bhajan-place-and-samadhi-of-shri-prabhodanand-sarasavati", ginfo: "https://goo.gl/maps/ubyjBtKntsQApYpaA", icon:"krishna.svg", }, 
    { lat: 27.57993203418959, lng: 77.68711584369228, lab: "SANATAN GOSWAMI SAMADHI", ind:25, zLevel:18, urlid: "https://www.radha.name/images-gallery/india-holy-places/vraja/sanatana-goswami-samadhi", ginfo: "https://goo.gl/maps/T1UNeBAAaAbJgPEu9", icon:"krishna.svg", }, 
    { lat: 27.580561928400776, lng: 77.68858837443183, lab: "ADVAITA VAT", ind:25, zLevel:18, urlid: "https://www.radha.name/images-gallery/india-holy-places/vraja/advaita-vat", ginfo: "https://goo.gl/maps/nomrmPUWvA3ZvaWN6", icon:"krishna.svg", }, 
    { lat: 27.58021372816651, lng: 77.6888071630413, lab: "ASHTA SAKHI TEMPLE", ind:25, zLevel:18, urlid: "#", ginfo: "https://goo.gl/maps/dCz9vRcaDWGzEFR27", icon:"krishna.svg", }, 
    { lat: 27.579752923782106, lng: 77.6904508207416, lab: "SRI BANKEY BIHARI TEMPLE", ind:25, zLevel:18, urlid: "https://www.bihariji.org/", ginfo: "https://goo.gl/maps/ufcvGyqycHEbYiA98", icon:"krishna.svg", },  
      
      //GOVERDHAN
    { lat: 27.5197178942894, lng: 77.48479877850193, lab: "GOVARDHAN", ind:25, zLevel:3, zLevel:3, urlid: "#", ginfo: "https://goo.gl/maps/4zCx9xJLhQD6wPpp8", icon:"krishna.svg", }, 
    { lat: 27.525081458207357, lng: 77.49168254653718, lab: "RADHA KUND", ind:25, zLevel:7, urlid: "https://www.stephen-knapp.com/radha_kund_the_holy_place_of_radharani.htm", ginfo: "https://goo.gl/maps/4zCx9xJLhQD6wPpp8", icon:"krishna.svg", }, 
    { lat: 27.525309804148232, lng: 77.49246575158456, lab: "SYAMA KUND", ind:25, zLevel:7, urlid: "https://www.stephen-knapp.com/radha_kund_the_holy_place_of_radharani.htm", ginfo: "https://goo.gl/maps/4zCx9xJLhQD6wPpp8", icon:"krishna.svg", }, 
    { lat: 277.49307936896383, lng: 77.49168254653718, lab: "LALITA KUND", ind:25, zLevel:12, urlid: "https://www.brajrasik.org/media/lalita-kund-govardhan", ginfo: "https://goo.gl/maps/2GT21zbnia3cCtBg6", icon:"krishna.svg", }, 
    { lat: 27.510114457454563, lng: 77.49942162770104, lab: "MUKHARA", ind:25, zLevel:15, urlid: "#", ginfo: "https://goo.gl/maps/1i81xdv7NZ9Pj7H18", icon:"krishna.svg", }, 
    { lat: 27.511981593412333, lng: 77.47868121796107, lab: "KUSUM SAROVAR", ind:25, zLevel:12, urlid: "https://www.brijwale.com/kusum-sarovar/", ginfo: "https://goo.gl/maps/JSSZJBmXhG8v2emY7", icon:"krishna.svg", }, 
    { lat: 27.511346925788526, lng: 77.4770211321736, lab: "UDDHAVA TEMPLE", ind:25, zLevel:12, urlid: "#", ginfo: "https://goo.gl/maps/ZrjzpyDnS93Mz7ih9", icon:"krishna.svg", }, 
    { lat: 27.511383110164253, lng: 77.47803227333397, lab: "ASHOKA VAN", ind:25, zLevel:12, urlid: "#", ginfo: "https://goo.gl/maps/LQwm7xNBHBfcH6Ja7", icon:"krishna.svg", }, 
    { lat: 27.507914079773926, lng: 77.48043647158617, lab: "NARAD KUND", ind:25, zLevel:12, urlid: "https://www.brajrasik.org/articles/59651da21350677a4962071d/narad-kund-goverdhan-braj", ginfo: "https://goo.gl/maps/Y6zVDkWsM8FqqGrx9", icon:"krishna.svg", }, 
    { lat: 27.510104305254927, lng: 77.47554085019405, lab: "RATNA KUND", ind:25, zLevel:12, urlid: "https://brajrasik.org/photo/60a8fc65f456840008988d38/beautiful-ratna-kund-near-shyam-kuti-govardhan", ginfo: "https://goo.gl/maps/fHiYwDptuFgQv3qz5", icon:"krishna.svg", }, 
    { lat: 27.50995835963838, lng: 77.47573376399964, lab: "RATNA SIMHASAN", ind:25, zLevel:12, urlid: "https://www.brajrasik.org/media/shri-shyam-kuti", ginfo: "https://goo.gl/maps/MUJTVVvRApUsK3w77", icon:"krishna.svg", }, 
    { lat: 27.507941060647802, lng: 77.47372244889648, lab: "GVAL-POKHAR", ind:25, zLevel:12, urlid: "#", ginfo: "https://goo.gl/maps/5ujZSgkzEc6M5DVw9", icon:"krishna.svg", }, 
    { lat: 27.505040618585923, lng: 77.4735574148382, lab: "JUGAL KUND", ind:25, zLevel:12, urlid: "#", ginfo: "https://goo.gl/maps/71VMwThRKEmQL3KU6", icon:"krishna.svg", }, 
    { lat: 27.499235716242488, lng: 77.465518674575, lab: "PANCHA TIRTH KUND", ind:25, zLevel:12, urlid: "#", ginfo: "https://goo.gl/maps/zPXfru4ydLMX5Q9C8", icon:"krishna.svg", }, 
    { lat: 27.49814129480846, lng: 77.46357115595866, lab: "MANASI GANGA", ind:25, zLevel:12, urlid: "https://www.brijwale.com/mansi-ganga/", ginfo: "https://goo.gl/maps/SiBRpsAAEakzjHoG6", icon:"krishna.svg", }, 
    { lat: 27.497914615860005, lng: 77.46533560282509, lab: "MUKHARVINDA", urlid: "#", ind:25, zLevel:12, ginfo: "https://goo.gl/maps/8usGGnNRLmNA1Ptk9", icon:"krishna.svg", }, 
    { lat: 27.49852465251434, lng: 77.46415161830271, lab: "CHAKALESHVAR MAHADEV", ind:25, zLevel:12, urlid: "https://sahasa.in/2022/02/16/chakleshwar-mahadev-mandir-chakreshwar-mahadev-govardhan-mathura-district-uttar-pradesh/", ginfo: "https://goo.gl/maps/Qi3P66oouJWQL4kG6", icon:"krishna.svg", }, 
    { lat: 27.49848882583308, lng: 77.4642226843168, lab: "BHAJAN KUTIR OF SANATAN GOSWAMI", ind:25, zLevel:12, urlid: "#", ginfo: "https://goo.gl/maps/644pTMqejVJL2Wp69", icon:"krishna.svg", }, 
    { lat: 27.49525794807103, lng: 77.46264172274351, lab: "DANA GHATI", ind:25, zLevel:12, urlid: "#", ginfo: "https://goo.gl/maps/4zCx9xJLhQD6wPpp8", icon:"krishna.svg", }, 
    { lat: 27.497686790220953, lng: 77.4654253221373, lab: "MANASI DEVI TEMPLE", ind:25, zLevel:12, urlid: "#", ginfo: "https://goo.gl/maps/FKX2WTugJVKn1sup8", icon:"krishna.svg", }, 
    { lat: 27.496893998208918, lng: 77.46419095599853, lab: "HARIDEVA TEMPLE", ind:25, zLevel:12, urlid: "https://www.radha.name/images-gallery/india-holy-places/vraja/haridev-temple", ginfo: "https://goo.gl/maps/j8jLuruVxUQpHeDh8", icon:"krishna.svg", }, 
    { lat: 27.49726291077347, lng: 77.46404827287286, lab: "BRAHMA KUNDA", ind:25, zLevel:12, urlid: "https://www.radha.name/video/govardhan-darshan-haridev-manasi-ganga-brahma-kund", ginfo: "https://goo.gl/maps/w3f3M47LD5xaRhTZA", icon:"krishna.svg", }, 
    { lat: 27.49526654953311, lng: 77.46263256849868, lab: "GIRIRAJ TEMPLE DAAN GHATI", ind:25, zLevel:12, urlid: "#", ginfo: "https://goo.gl/maps/vfwingG2VYDn5cecA", icon:"krishna.svg", }, 
    { lat: 27.491881426013293, lng: 77.46133357364462, lab: "ISKCON TEMPLE", ind:25, zLevel:12, urlid: "https://iskcongovardhan.com/", ginfo: "https://goo.gl/maps/6Vdq7hVZJ5AtPchaA", icon:"krishna.svg", }, 
    { lat: 27.49199007169113, lng: 77.46559730188778, lab: "PAPAMOCHAN KUND", ind:25, zLevel:12, urlid: "#", ginfo: "https://goo.gl/maps/Dc6NyyXua9vfGjFv9", icon:"krishna.svg", }, 
    { lat: 27.490550231871655, lng: 77.45949001574252, lab: "DAN NIVARTAN KUND", ind:25, zLevel:12, urlid: "https://akincana.net/2021/01/23/dan-nivartan-kund-govardhan-hg-deena-bandhu-das/", ginfo: "https://goo.gl/maps/fecBChTxeuvDSiEN7", icon:"krishna.svg", }, 
    { lat: 27.477905699139566, lng: 77.46979522142799, lab: "CHANDRA SAROVAR", ind:25, zLevel:12, urlid: "https://www.brajfoundation.org/projects.php?brajfoundation=23", ginfo: "https://goo.gl/maps/fQTdZVMYTDTqdWQQ6", icon:"krishna.svg", }, 
    { lat: 27.476781989961218, lng: 77.46879924366412, lab: "SURADAS JI SAMADHI", ind:25, zLevel:12, urlid: "#", ginfo: "https://goo.gl/maps/jpEWYFLBuH2rvW1o6", icon:"krishna.svg", }, 
    { lat: 27.468163607073294, lng: 77.44714980244233, lab: "GAURI KUND", ind:25, zLevel:12, urlid: "https://www.facebook.com/103853734318638/posts/gauri-kunda-leelawhen-lord-krsna-disguised-as-devi-gauri-abhimanyuradharanis-hus/322374452466564/", ginfo: "https://goo.gl/maps/pQ6gprajoTz8RoBC8", icon:"krishna.svg", }, 
    { lat: 27.468923254801727, lng: 77.44945655975998, lab: "ANIYOR VILLAGE", ind:25, zLevel:12, urlid: "#", ginfo: "https://goo.gl/maps/ifSPTn4bbsym4vdd6", icon:"krishna.svg", }, 
    { lat: 27.473483969132545, lng: 77.44375187763163, lab: "GOPAL RAJ TEMPLE", ind:25, zLevel:12, urlid: "#", ginfo: "https://goo.gl/maps/3pwQR1Ruv2Uj4NsJ7", icon:"krishna.svg", }, 
    { lat: 27.4725083847166, lng: 77.4442113252051, lab: "BALARAM (DAUJI) TEMPLE", ind:25, zLevel:12, urlid: "https://dhama108.blogspot.com/p/balaram-dauji-temple.html", ginfo: "https://goo.gl/maps/n4wx1DBVtRcXsUiR9", icon:"krishna.svg", }, 
    { lat: 27.46879245303961, lng: 77.44002722623092, lab: "MADHAVENDRA PURI BHAJAN KUTIR", ind:25, zLevel:12, urlid: "https://radhanathswamiyatras.com/govardhan/govind-kund/", ginfo: "https://goo.gl/maps/7iDfWDZHZKnrmSJMA", icon:"krishna.svg", }, 
    { lat: 27.468492053485594, lng: 77.44067601307951, lab: "GOVINDA KUND", ind:25, zLevel:12, urlid: "https://radhanathswamiyatras.com/govardhan/govind-kund/", ginfo: "https://goo.gl/maps/8yeZv4DcrbpoQNit7", icon:"krishna.svg", }, 
    { lat: 27.471153245684697, lng: 77.44526223294221, lab: "SANKARSHAN KUND", ind:25, zLevel:12, urlid: "https://www.brajrasik.org/articles/61fcf3df5d08590009accc93/sankarshan-kund-govardhan", ginfo: "https://goo.gl/maps/MvUoERLtTwByoTiA9", icon:"krishna.svg", }, 
    { lat: 27.471966514477298, lng: 77.44240983727627, lab: "GOPAL PRAKAT STHALI", ind:25, zLevel:12, urlid: "#", ginfo: "https://goo.gl/maps/QgcugoyrmpfSBEuN9", icon:"krishna.svg", }, 
    { lat: 27.46823976140004, lng: 77.442351982915, lab: "NIPA-KUND", ind:25, zLevel:12, urlid: "#", ginfo: "https://goo.gl/maps/JWm5voSzUmGr3fWk6", icon:"krishna.svg", }, 
    { lat: 27.46428325660996, lng: 77.43686761313377, lab: "DOKA-DAUJI TEMPLE", ind:25, zLevel:12, urlid: "#", ginfo: "https://goo.gl/maps/AJqRuY2ZRvBw6Q8z6", icon:"krishna.svg", }, 
    { lat: 27.45918912882992, lng: 77.43132664323454, lab: "NRSIMHA TEMPLE", ind:25, zLevel:12, urlid: "https://www.holydham.com/narasimha-temple/", ginfo: "https://goo.gl/maps/zeEkvVXPMfujQmL5A", icon:"krishna.svg", }, 
    { lat: 27.459034064757844, lng: 77.43035025316085, lab: "NAVAL-KUND", ind:25, zLevel:12, urlid: "https://www.brajrasik.org/articles/6206ce33a36cec0009f35880/naval-kund-and-apsara-kund-govardhan", ginfo: "https://goo.gl/maps/49Kg6eZ19PUiEXyd6", icon:"krishna.svg", }, 
    { lat: 27.458512308848007, lng: 77.43020220013256, lab: "NAVAL-BIHARI TEMPLE", ind:25, zLevel:12, urlid: "https://dhama108.blogspot.com/p/naval-bihari-temple.html", ginfo: "https://goo.gl/maps/iLBUdVJ4KSerrY6h9", icon:"krishna.svg", }, 
    { lat: 27.459273341694416, lng: 77.42989063465264, lab: "APSARA KUND", ind:25, zLevel:12, urlid: "https://www.brajrasik.org/articles/6206ce33a36cec0009f35880/naval-kund-and-apsara-kund-govardhan", ginfo: "https://goo.gl/maps/5twzu4BS3Nf9AbXt6", icon:"krishna.svg", }, 
    { lat: 27.45905830059276, lng: 77.42860756831466, lab: "PUNCHARI KA LOTA BABA TEMPLE", ind:25, zLevel:12, urlid: "https://shrimathuraji.com/puchri-ka-lota-temple-govardhan/", ginfo: "https://goo.gl/maps/Rrzh6u1YvG85wsa66", icon:"krishna.svg", }, 
    { lat: 27.459302054128422, lng: 77.4171107181634, lab: "SYAMA DHAKA", ind:25, zLevel:12, urlid: "#", ginfo: "https://goo.gl/maps/ZQnBzjVQvBk4NUH9A", icon:"krishna.svg", }, 
    { lat: 27.46015492693057, lng: 77.43107891965538, lab: "MANI KANDALI CAVE", ind:25, zLevel:12, urlid: "#", ginfo: "https://goo.gl/maps/AsCT89VQSn49bGuP6", icon:"krishna.svg", }, 
    { lat: 27.460585558927317, lng: 77.43100763541149, lab: "RAGHAV PANDIT CAVE", ind:25, zLevel:12, urlid: "https://dhama108.blogspot.com/p/raghava-pandit-cave.html", ginfo: "https://goo.gl/maps/dGU1HqeCAiTVQMmCA", icon:"krishna.svg", }, 
    { lat: 27.460397771312387, lng: 77.43078528314399, lab: "NATH JI TEMPLE", ind:25, zLevel:12, urlid: "https://dhama108.blogspot.com/p/nath-ji-temple-punchari-ka-lota.html", ginfo: "https://goo.gl/maps/wNdK5YbbPFUQCtVF6", icon:"krishna.svg", }, 
    { lat: 27.4655261558133, lng: 77.4364081218431, lab: "AIRAVAT'S FOOTPRINTS", ind:25, zLevel:12, urlid: "#", ginfo: "https://goo.gl/maps/CBgcVEQXtCLfEm3q6", icon:"krishna.svg", }, 
    { lat: 27.465350504179142, lng: 77.43537410517358, lab: "indRA KUND", ind:25, zLevel:12, urlid: "https://www.holydham.com/indra-kunda/", ginfo: "https://goo.gl/maps/3NYXRDMxCrsrMGsv7", icon:"krishna.svg", }, 
    { lat: 27.467112291074926, lng: 77.436102997752, lab: "SURABHI-KUND", ind:25, zLevel:12, urlid: "https://www.brajrasik.org/articles/5b1bd6d69f7ab760360f9c86/surabhi-kunda-goverdhan-divine-pastimes", ginfo: "https://goo.gl/maps/6oMFTvgJdkTHC5yn7", icon:"krishna.svg", }, 
    { lat: 27.47104383560143, lng: 77.43793298966894, lab: "HARIJU KUND & RUDRA KUNDA", ind:25, zLevel:12, urlid: "https://www.brajrasik.org/articles/5890d1918b03045e30966113/rudra-kunda-(rudana-kund)-braj", ginfo: "https://goo.gl/maps/oMitTPAfbdEoPCHC9", icon:"krishna.svg", }, 
    { lat: 27.470220551276107, lng: 77.43858782488229, lab: "AIRAVAT KUND", ind:25, zLevel:12, urlid: "https://www.holydham.com/airavata-kunda/", ginfo: "https://goo.gl/maps/an6ynPiv2gt9u31U8", icon:"krishna.svg", }, 
    { lat: 27.47591065787787, lng: 77.43795815571308, lab: "GULAL KUND", ind:25, zLevel:12, urlid: "#", ginfo: "https://goo.gl/maps/aKNs4FFfToUCb2na6", icon:"krishna.svg", }, 
    { lat: 27.473287385283278, lng: 77.44243592378086, lab: "MUKHARVindA, VITTHAL'S SAMADHI", ind:25, zLevel:12, urlid: "#", ginfo: "https://goo.gl/maps/yoHFcw76TE1gQAt57", icon:"krishna.svg", }, 
    { lat: 27.474234374554783, lng: 77.44332830846959, lab: "DANDAVAT SHILA", ind:25, zLevel:12, urlid: "#", ginfo: "https://goo.gl/maps/jbm26uqexjR6Nt8m6", icon:"krishna.svg", }, 
    { lat: 27.51380327268149, lng: 77.47655228994935, lab: "UDDHAVA KUND", ind:25, zLevel:12, urlid: "https://www.brajrasik.org/articles/5b64384a4b7ba00054cbe6a0/uddhava-kunda", ginfo: "https://goo.gl/maps/qrNwEZ31iRa5QKEQ7", icon:"krishna.svg", }, 
    { lat: 27.52385140000905, lng: 77.48765492527409, lab: "SIVA KHARI", ind:25, zLevel:12, urlid: "#", ginfo: "https://goo.gl/maps/Vf5ojVHfkhUAXStAA", icon:"krishna.svg", }, 
    { lat: 27.5317213689318, lng: 77.49165672432666, lab: "RADHA KUNJA BIHARI GAUDIYA MATH", ind:25, zLevel:12, urlid: "https://dhama108.blogspot.com/p/radha-kunj-bihari-gaudiya-math.html", ginfo: "https://goo.gl/maps/jaLBcTx2XgFeKBfA8", icon:"krishna.svg", },
  
  ];
  var mayapur = [
    {  lat:23.426249835400746, lng: 88.39265510213058, lab:"MAYAPUR",ind:35, zLevel:1,urlid: "#", ginfo: "https://goo.gl/maps/G5yL2E77FUcbGQGC6" ,icon:"lcm.svg"},
    {  lat:24.0623153805446, lng: 87.84759153724147, lab:"EKCHAKRA",ind:25, zLevel:3, zLevel:3,urlid: "#", ginfo: "https://goo.gl/maps/G5yL2E77FUcbGQGC6" ,icon:"lcm.svg"},
    {  lat:23.433832843578383, lng: 88.39469840429076, lab:"ANTAR-DVIPA",ind:25, zLevel:7,urlid: "#", ginfo: "https://goo.gl/maps/G5yL2E77FUcbGQGC6" ,icon:"lcm.svg"},
    {  lat:23.453735498965536, lng: 88.42058161158862, lab:"SIMANTA-DVIPA",ind:25, zLevel:7,urlid: "#", ginfo: "https://goo.gl/maps/G5yL2E77FUcbGQGC6" ,icon:"lcm.svg"},
    { lat: 23.407490410783033, lng: 88.44594187269469, lab:"GODRUMA-DVIPA",ind:25, zLevel:7,urlid: "#", ginfo: "https://goo.gl/maps/G5yL2E77FUcbGQGC6" ,icon:"lcm.svg"},
    {  lat:23.38835125685773, lng: 88.39280427917754, lab:"MADHYA-DVIPA",ind:25, zLevel:7,urlid: "#", ginfo: "https://goo.gl/maps/G5yL2E77FUcbGQGC6" ,icon:"lcm.svg"},
    {  lat:23.405459612168794, lng: 88.37185121861664, lab:"KOLA-DVIPA",ind:22,urlid: "#", ginfo: "https://goo.gl/maps/G5yL2E77FUcbGQGC6" ,icon:"lcm.svg"},
    {  lat:23.391976905178545, lng: 88.3168496863288, lab:"RITU-DVIPA",ind:25, zLevel:7,urlid: "#", ginfo: "https://goo.gl/maps/G5yL2E77FUcbGQGC6" ,icon:"lcm.svg"},
    {  lat:23.42430629266497, lng: 88.31634540186629, lab:"JAHNU-DVIPA",ind:25, zLevel:7,urlid: "#", ginfo: "https://goo.gl/maps/G5yL2E77FUcbGQGC6" ,icon:"lcm.svg"},
    {  lat:23.442725739736627, lng: 88.31093699375181, lab:"MODADRUMA-DVIPA",ind:25, zLevel:7,urlid: "#", ginfo: "https://goo.gl/maps/G5yL2E77FUcbGQGC6" ,icon:"lcm.svg"},
    {  lat:23.479927446319266, lng: 88.40992505966625, lab:"RUDRA-DVIPA",ind:7,urlid: "#", ginfo: "https://goo.gl/maps/G5yL2E77FUcbGQGC6" ,icon:"lcm.svg"},
  { lat:23.424618606328725, lng: 88.38907942803779, lab:"TOVP",ind:25, zLevel:12,urlid: "#", ginfo: "https://goo.gl/maps/G5yL2E77FUcbGQGC6" ,icon:"lcm.svg"},
  { lat: 23.41364287823115, lng: 88.42830693022384, lab: "SUVARANA VIHAR GAUDIYA MATH",ind:25, zLevel:15, urlid: "https://navadwipaparikrama.com/places/suvarna-vihar/", ginfo: "https://goo.gl/maps/G5yL2E77FUcbGQGC6" ,icon:"lcm.svg"},
  { lat: 23.41054920477204, lng: 88.39893130088076, lab: "GAURA DAHA",ind:25, zLevel:15, urlid: "https://thegaudiyatreasuresofbengal.com/2020/03/25/goradaha-gaura-daha-lord-gaurangas-lake-gadigacha-godrumadvipa/", ginfo: "https://goo.gl/maps/892QhS3Vtginfo: bqFnoFx8" ,icon:"lcm.svg"},
  { lat: 23.415418983173858, lng: 88.39394865619299, lab: "SVANANDA SUKHADA KUNJA",ind:25, zLevel:12, urlid: "https://navadwipaparikrama.com/places/svananda-sukhada-kunja/", ginfo: "https://goo.gl/maps/6gNNkEPKscF32ekL9" ,icon:"lcm.svg"},
  { lat: 23.414828268357688, lng: 88.39110884051584, lab: "SURABHI KUNJA",ind:25, zLevel:15, urlid: "https://navadwipaparikrama.com/places/surabhi-kunja/", ginfo: "https://goo.gl/maps/S1sdyDgyE25zAXTG7",icon:"lcm.svg" },
  { lat: 23.413371282049937, lng: 88.3866574678109, lab: "BHAKTI VEDANTA AROGYA ASHRAM",ind:25, zLevel:18, urlid: "#", ginfo: "https://goo.gl/maps/X3GHJPpCZg7Y2MJJ7" ,icon:"lcm.svg"},
  { lat: 23.401629554499774, lng: 88.38982919529631, lab: "HAMSA-VAHAN TEMPLE",ind:25, zLevel:14, urlid: "https://navadwipaparikrama.com/places/hamsa-vahana-siva-temple/", ginfo: "https://goo.gl/maps/kjCszke5Dhh87W9M6" ,icon:"lcm.svg"},
  { lat: 23.398648514133846, lng: 88.39587061441334, lab: "NAIMISHARANYA",ind:25, zLevel:16, urlid: "https://mayapur.in/en/naimisharanya/", ginfo: "https://goo.gl/maps/yyduLRXCkst9nfaLA",icon:"lcm.svg" },
  { lat: 23.385179434133224, lng: 88.36929234294557, lab: "PANCHA VENI",ind:25, zLevel:16, urlid: "https://mayapur.in/en/panchaveni/", ginfo: "https://goo.gl/maps/NFTgd1FA4wpMTVxF9",icon:"lcm.svg" },
  { lat: 23.411351843116822, lng: 88.36398393430434, lab: "PRAUDH MAYA TEMPLE",ind:25, zLevel:16, urlid: "https://mayapur.in/en/paramatala/", ginfo: "https://goo.gl/maps/jaUtfcNPWrp97hJa9" ,icon:"lcm.svg"},
  { lat: 23.41257024578104, lng: 88.36905832187898, lab: "DHAMESHVAR MAHAPRABHU",ind:25, zLevel:14, urlid: "https://thegaudiyatreasuresofbengal.com/2018/01/12/worshipable-deity-srimati-vishnupriya-devi-sri-dhameswar-mahaprabhu-temple-navadvipa-koladvipa/", ginfo: "https://goo.gl/maps/8bHfN7XU4qReR8sV7" ,icon:"lcm.svg"},
  { lat: 23.41560850880499, lng: 88.37164902980518, lab: "JAGANNATH DAS BABAJI SAMADHI",ind:25, zLevel:12, urlid: "https://mayapur.in/en/jagannath-das-babaji-samadhi/", ginfo: "https://goo.gl/maps/b3SsmEpUwS8i1iih9" ,icon:"lcm.svg"},
  { lat: 23.436026237996735, lng: 88.33569433177958, lab: "ARKA TILA",ind:25, zLevel:12, urlid: "https://mayapur.in/en/arka-tila/", ginfo: "https://goo.gl/maps/MsQENQMRWE3GSQ2EA" ,icon:"lcm.svg"},
  { lat: 23.42856977158349, lng: 88.32848580948077, lab: "VRindAVAN DAS THAKUR BIRTH PLACE",ind:25, zLevel:12, urlid: "https://www.mayapur.com/2020/srila-vrindavan-das-thakur-3/", ginfo: "https://goo.gl/maps/SvFVygzAvtM6ou6BA" ,icon:"lcm.svg"},
  { lat: 23.426305734267103, lng: 88.32771473378017, lab: "SARANG MURARI SRIPAT MAMGACHI",ind:25, zLevel:12, urlid: "https://navadwipaparikrama.com/places/sri-saranga-murari-sripata/", ginfo: "https://goo.gl/maps/u66hWeJ7ahnYuybBA",icon:"lcm.svg" },
  { lat: 23.419305595703204, lng: 88.32756990924445, lab: "JAHNUMUNI ASHRAM",ind:25, zLevel:12, urlid: "https://mayapur.in/en/jahnu-muni-ashram/", ginfo: "https://goo.gl/maps/DnNaKB7gh5X4DeHGA",icon:"lcm.svg" },
  { lat: 23.41853213615652, lng: 88.42107004792652, lab: "AMRAGHATA",ind:25, zLevel:12, urlid: "https://radhanathswamiyatras.com/about-mayapur/godrumadvipa/", ginfo: "https://goo.gl/maps/asc9WAPDaybwxbkL6",icon:"lcm.svg" },
  { lat: 23.405529922676827, lng: 88.41981912100299, lab: "HARI HAR KSHETRA DEITY",ind:25, zLevel:12, urlid: "https://mayapur.in/en/harihara-kshetra/", ginfo: "https://goo.gl/maps/hQrxouhBZXzXRNKZA",icon:"lcm.svg" },
  { lat: 23.406376961877932, lng: 88.41837077464291, lab: "ALAKNANDA RIVER",ind:25, zLevel:12, urlid: "https://navadwipaparikrama.com/places/alakananda/", ginfo: "https://goo.gl/maps/DmBZ4yruHHhBp8oGA" ,icon:"lcm.svg"},
  { lat: 23.389149314604275, lng: 88.44424855704044, lab: "MANDAKINI LAKE",ind:25, zLevel:12, urlid: "https://navadwipaparikrama.com/places/devapalli/", ginfo: "https://goo.gl/maps/tGFLWRTAjDHBqd7A9",icon:"lcm.svg" },
  { lat: 23.387698230486873, lng: 88.44399041199686, lab: "NRSIMHA TEMPLE NRSIMHAPALLI",ind:25, zLevel:12, urlid: "https://thegaudiyatreasuresofbengal.com/2018/01/09/ancient-temple-nrsimha-palli-navadvipa-godrumadvipa/", ginfo: "https://goo.gl/maps/dJfXU8YHjtuXna5j6",icon:"lcm.svg" },
  { lat: 23.34680533565312, lng: 88.32161714328846, lab: "SAMUDRAGARH",ind:25, zLevel:12, urlid: "https://mayapur.in/en/samudragarh/", ginfo: "https://goo.gl/maps/DxCENFw9QhRaQk8EA",icon:"lcm.svg" },
  { lat: 23.37352954286997, lng: 88.3259364156848, lab: "GAUR GADADHAR TEMPLE",ind:25, zLevel:12, urlid: "https://thegaudiyatreasuresofbengal.com/2018/01/09/remembering-sri-gadadhara-pandita-gaur-gadadhara-gaudiya-math-champahati-navadvipa/", ginfo: "https://goo.gl/maps/RQ38WAvrgeUFp7d3A",icon:"lcm.svg" },
  //{lat: 23.740416468430467,lng: 87.94114796238034,lab:"VIDYANAGAR LORD CAITANYA",urlid: "https://dhama108.blogspot.com/p/vidyanagar-lord-caitanya.html",ginfo: "https://goo.gl/maps/RdKL7TDPwMp64WpN8",icon:"lcm.svg"},
  { lat: 23.47671025771687, lng: 88.3747965726924, lab: "SHANKARPUR RUDRA DVIPA",ind:25, zLevel:12, urlid: "#", ginfo: "https://goo.gl/maps/JvCyuZXDkxXSQSuQ8" ,icon:"lcm.svg"},
  { lat: 23.42095995636279, lng: 88.38637588706716, lab: "NANDAN ACHARYA BHAVAN",ind:25, zLevel:12, urlid: "https://thegaudiyatreasuresofbengal.com/2018/07/05/meeting-gauranga-nityananda-residence-nandan-acharya-mayapur/", ginfo: "https://goo.gl/maps/2s33HdiBgm6nBc4w6",icon:"lcm.svg" },
  { lat: 23.438678728764458, lng: 88.39296929655022, lab: "SRI YOGA PITHA",ind:25, zLevel:12, urlid: "https://mayapur.in/en/yogapith/", ginfo: "https://goo.gl/maps/D4jaXsdHg9Y4bANp9",icon:"lcm.svg" },
  { lat: 23.439946156429723, lng: 88.39424394912601, lab: "SRIVAS ANGAN",ind:25, zLevel:12, urlid: "https://navadwipaparikrama.com/places/sri-srivasa-angana/", ginfo: "https://goo.gl/maps/pKo6BZbG5EVVKpAj7",icon:"lcm.svg" },
  { lat: 23.440408798505366, lng: 88.39465700933468, lab: "ADVAITA BHAVAN",ind:25, zLevel:12, urlid: "https://mayapur.in/en/advaita-bhavan/", ginfo: "23.440408798505366, 88.39465700933468",icon:"lcm.svg" },
  { lat: 23.442360222362932, lng: 88.39869813294206, lab: "SRILA BHAKTI SIDDHANTA SARASWATI SAMADHI",ind:25, zLevel:12, urlid: "https://radhanathswamiyatras.com/mayapur-photo-gallery/attachment/bhaktisiddhanta-saraswati-thakur-samadhi-in-antardvipa/", ginfo: "https://goo.gl/maps/Xb5xaNWyv8SMoFnEA",icon:"lcm.svg" },
  { lat: 23.442120292048113, lng: 88.3996421882842, lab: "SRILA GAUR KISHOR DAS BABAJI SAMADHI",ind:25, zLevel:12, urlid: "https://www.mayapur.com/2020/srila-gaura-kishora-dasa-babaji-disappearance-day/", ginfo: "https://goo.gl/maps/zySKYFbKQVYCguWR7",icon:"lcm.svg" },
  { lat: 23.44239753382513, lng: 88.3993843851429, lab: "SRI GANDHARVIKA GIRIDHARI TEMPLE",ind:25, zLevel:12, urlid: "https://navadwipaparikrama.com/places/sri-caitanya-math/", ginfo: "https://goo.gl/maps/4vsc2DKFtqNanfxk8",icon:"lcm.svg" },
  { lat: 23.442512361875433, lng: 88.40016352575587, lab: "SRILA BSST BHAJAN KUTIR",ind:25, zLevel:12, urlid: "#",ginfo: "https://goo.gl/maps/722pbC27GBd6Htpe6",icon:"lcm.svg" },
  { lat: 23.442175912902286, lng: 88.3997617554064, lab: "RADHA KUND",ind:25, zLevel:12, urlid: "#", ginfo: "https://goo.gl/maps/CRBy5fxk1FFNAWXc7",icon:"lcm.svg" },
  { lat: 23.440474450628784, lng: 88.39473974655722, lab: "GADADHARA PANDITA'S BHAVAN",ind:25, zLevel:12, urlid: "https://www.mayapur.com/2022/appearance-of-sri-gadadhara-pandit-april-30th-2022/", ginfo: "https://goo.gl/maps/FqRVvoQBrNu9pJeV8",icon:"lcm.svg" },
  { lat: 23.446924761952058, lng: 88.40515817186167, lab: "CHAND KAZI SAMADHI",ind:25, zLevel:12, urlid: "https://navadwipaparikrama.com/places/chand-kazi-samadhi/", ginfo: "https://goo.gl/maps/HitW8u7Jhtk66jGWA",icon:"lcm.svg" },
  { lat: 23.449162219502966, lng: 88.40291868726779, lab: "BALLAL DHIPI",ind:25, zLevel:12, urlid: "https://en.wikipedia.org/wiki/Ballal_Dhipi", ginfo: "https://goo.gl/maps/NjKsnfVPqsygXsH96",icon:"lcm.svg" },
  { lat: 23.444801522198485, lng: 88.41363209332174, lab: "SRIDHAR ANGAN",ind:25, zLevel:12, urlid: "https://mayapur.in/en/sridhara-angan/", ginfo: "https://goo.gl/maps/aEJykAtUNKNAmxPj9",icon:"lcm.svg" },
  { lat: 23.447671108846272, lng: 88.4163175506436, lab: "JAGANNATH TEMPLE RAJAPUR",ind:25, zLevel:12, urlid: "https://www.mayapur.com/visit-mayapur/places-to-visit/jagannatha-mandir/", ginfo: "https://goo.gl/maps/AYQU1HtzKPmGLX5X8",icon:"lcm.svg" },
  { lat: 23.44788254697552, lng: 88.41540780224543, lab: "SIMANTINI DEVI TEMPLE",ind:25, zLevel:12, urlid: "https://mayapur.in/en/simantini-devi-temple/", ginfo: "https://goo.gl/maps/cJhF7xLZ8gxEMFaP7",icon:"lcm.svg" },
  { lat: 23.462483598377716, lng: 88.42685626546505, lab: "MEGHERA CHARAN",ind:25, zLevel:12, urlid: "https://www.backtogodhead.in/early-miracles-of-caitanya-mahaprabhu-by-amala-bhakta-dasa/", ginfo: "https://goo.gl/maps/KkGGHhKrhYhwroqT9",icon:"lcm.svg" },
  { lat: 23.477046175172205, lng: 88.41150799921442, lab: "MADAN GOPAL JI BELPUKUR",ind:25, zLevel:12, urlid: "https://www.mayapur.com/serve-mayapur/support-belpukur-temple/", ginfo: "https://goo.gl/maps/RFB9oxn7mPmE4v6c7",icon:"lcm.svg" },
  //{23.477342573474584, 88.41068485045722,lab:"PANCHVAKTRESHVAR SIVA TEMPLE","","https://goo.gl/maps/Bt8sjeD5dz8i2qka6"},
  //BILVA PUSHKAR, PANCHVAKTRA SIVA, MEGHERA CHARAN, REMAINS OF SACHI MATA HOUSE
  { lat: 23.439669594253317, lng: 88.39780393131407, lab: "MURARI GUPTA SRIPAT",ind:25, zLevel:12, urlid: "https://thegaudiyatreasuresofbengal.com/2018/01/12/1049/", ginfo: "https://goo.gl/maps/5y4NteJTCj9KWdg79",icon:"lcm.svg" },
  { lat: 23.4247500627928,lng: 88.39023830802306,lab: "SRI SRI RADHA MADHAV ASHTA SAKHI",ind:25, zLevel:12,urlid: "https://www.mayapur.com/",ginfo: "https://goo.gl/maps/8pLnN39vQ3hjL3mH9",icon:"krishna.svg"},
{ lat: 23.424613930414154,lng: 88.3891245063177, lab: "TEMPLE OF VEDIC PLANETARIUM", urlid: "https://tovp.org/", ginfo: "https://goo.gl/maps/vLdcMw5Z4vSk3uM36", icon:"krishna.svg", ind:25, zLevel:12,},
{ lat: 23.42362054240791, lng: 88.38813904628391,lab: "HDG SRILA PRABHUPADA PUSHPA SAMADHI", urlid: "https://www.mayapur.com/serve-mayapur/online-puja/srila-prabhupada-samadhi-seva/",ginfo: "https://goo.gl/maps/RMGU2mYcep2GmEeE7",icon:"krishna.svg",ind:25, zLevel:12},
  
//jagannath puri
  
  { lat: 18.270039534379325, lng: 84.00652977115757, lab: "SRI KURMAM",ind:25, zLevel:7, urlid: "https://www.krishna.com/kurmakshetra", ginfo: "https://goo.gl/maps/kuy9XRcZS7SULrMv9" },
  { lat: 17.766412155761124, lng: 83.2505353779975, lab: "SIMHACHALAM-JIYAD NRSIMHA",ind:25, zLevel:7, urlid: "http://simhachalamdevasthanam.net/home.html", ginfo: "https://goo.gl/maps/aMq4zbmZ3DQ46YF39" },
   
 
  { lat: 16.979734687107406, lng: 81.73048086265854, lab: "RAJMUNDRY",ind:25, zLevel:3, zLevel:3, urlid: "#", ginfo: "https://goo.gl/maps/ZnWJnd3uzpZW4WsP9" },
  { lat: 17.01660699630294, lng: 81.73495239545447, lab: "CAITANYA-RAMANANDA MEETING PLACE",ind:25, zLevel:7, urlid: "https://www.radha.name/news/india/sri-ramananda-raya-and-rajahmundry-yatra", ginfo: "https://goo.gl/maps/ZnWJnd3uzpZW4WsP9" },
  { lat: 17.01665138995829, lng: 81.73758872352607, lab: "SRI GHOSAPADA/ GAUTAM MUNI ASHRAM",ind:25, zLevel:12, urlid: "https://www.radha.name/news/india/sri-ramananda-raya-and-rajahmundry-yatra", ginfo: "https://goo.gl/maps/4XPq9UMf5AHF7GWe6" },
  { lat: 17.020542579564914, lng: 81.72834474734174, lab: "SRI VARADA GOPAL TEMPLE",ind:25, zLevel:12,urlid:"https://www.radha.name/news/india/sri-ramananda-raya-and-rajahmundry-yatra", ginfo: "https://goo.gl/maps/CbKWhV9xHZzxM4rD7" },
  { lat: 16.964159302772696, lng: 81.78416473873362, lab: "SRI LAXMI NRSIMHA SWAMI TEMPLE",ind:25, zLevel:12, urlid: "https://www.radha.name/news/india/sri-ramananda-raya-and-rajahmundry-yatra", ginfo: "https://goo.gl/maps/KYD5u1tTRmCobF6L7" },
  { lat: 16.990300911619276, lng: 81.77529741946056, lab: "ANTARVEDI-GODAVARI SANGAM",ind:25, zLevel:12, urlid:"https://www.radha.name/news/india/sri-ramananda-raya-and-rajahmundry-yatra",ginfo: "https://goo.gl/maps/JpvMXG4fHu3a28Gh9" },
  { lat: 16.78000403733249, lng: 81.80036670391908, lab: "SRI JAGAN MOHINI KESAVA SWAMY TEMPLE",ind:25, zLevel:12,urlid:"https://www.radha.name/news/india/sri-ramananda-raya-and-rajahmundry-yatra", ginfo: "https://goo.gl/maps/Uus2gsNfaqkdt8Gp8" },
  { lat: 16.99042282168339, lng: 81.77562839925596, lab: "ISKCON, SRI SRI RADHA-GOPINATH DASHAVATAR TEMPLE",ind:25, zLevel:12, urlid: "#", ginfo: "https://goo.gl/maps/EUJ8CUGRrCiksNvQ9" },
  
  
  
  
  
      /**
      {lab:"PANAKALA LAXMI NRSIMHA"},
      {lab:"MALLIKARJUNA TEMPLE"},
      {lab:"AHOBILAM"},
      {lab:"SRI VENKATESVARA"},
      {lab:"SRI KALAHASTHEESWARA"},
  
      */
  
  
  
      {lat: 28.71040745090528,lng: 76.93837943432139,lab:"ISKCON BAHADURGARH",ind:25, zLevel:12,urlid: "https://iskconbahadurgarh.com/",ginfo: "https://goo.gl/maps/LrUMyb8HL8ruWdmb9"},
      {lat: 28.72932717864652,lng: 77.09694192815691,lab:"ISKCON ROHINI",ind:25, zLevel:12,urlid: "https://iskconrohini.org/",ginfo: "https://goo.gl/maps/sKGzjZ2ufrDh1e9t8"},
      {lat: 28.660075251737535,lng: 77.1235767314333,lab:"ISKCON PUNJABI BAGH",ind:25, zLevel:12,urlid: "https://www.iskconpunjabibagh.com/",ginfo: "https://goo.gl/maps/7wgZxWzDaRjTYv998"},
      {lat: 28.556191381200147,lng: 77.2538867025953,lab:"ISKCON DELHI GLORY OF indIA",ind:25, zLevel:12,urlid: "https://www.iskcondelhi.com/",ginfo: "https://goo.gl/maps/xV3twHE6vFHHkhhZ7"},
      {lat: 18.447771444985555,lng: 73.8806078890298,lab:"ISKCON NVCC",ind:25, zLevel:12,urlid: "https://www.iskconpune.com/",ginfo: "https://goo.gl/maps/SUw2S8ssHSYDrbMh6"},
      {lat: 17.677250261875407,lng: 75.33621652963832,lab:"SRI SRI RUKMINI VITTHAL TEMPLE",ind:25, zLevel:3, zLevel:3,urlid: "https://www.vitthalrukminimandir.org/english/home.html",ginfo: "https://goo.gl/maps/pJqFmrEuMfDoQYMA7"},
      //{lat: 17.681752312837414,lng: 75.34162507962711,lab:"ISKCON PANDHARPUR",ind:25, zLevel:12,urlid: "https://www.facebook.com/iskconpandharpurofficial108/",ind:25, zLevel:12,ginfo: "https://goo.gl/maps/XoxzBVRhiUpMm3gK6"},
      {lat: 19.11301552992998,lng: 72.82656563738824,lab:"ISKCON JUHU",ind:25, zLevel:12,urlid: "https://iskconmumbai.com/",ginfo: "https://goo.gl/maps/E8DqWys1fKH9gBwd7"},
      {lat: 19.26944817671035,lng: 72.87165538427152,lab:"ISKCON MIRA ROAD",ind:25, zLevel:12,urlid: "https://iskconmiraroad.in/",ginfo: "https://goo.gl/maps/dQqQFCamnpgEZi9b8"},
      {lat: 18.95767724521506,lng: 72.80979752097352,lab:"ISKCON CHOWPATTY",ind:25, zLevel:12,urlid: "https://iskconchowpatty.com/",ginfo: "https://goo.gl/maps/rhPobuzPkByfQLxb7"},
      
      {lat: 29.99,lng: 76.78460923490213,lab:"KURUKSHETRA",ind:25, zLevel:3, zLevel:3,urlid: "#",ginfo: "https://goo.gl/maps/Etv9M8efA9HV5WAq6"},
      {lat: 29.96193369851989,lng: 76.78460923490213,lab:"ISKCON KURUKSHETRA",ind:25, zLevel:12,urlid: "https://iskconkurukshetra.org/",ginfo: "https://goo.gl/maps/Etv9M8efA9HV5WAq6"},
      {lat: 29.961897369926866,lng:  76.8273759822878,lab:"BRAHMA SAROVAR",ind:25, zLevel:12,urlid:"",ginfo: "https://goo.gl/maps/UBLzsxiN1Md1H8Q99"},
      {lat: 29.9616674579072, lng: 76.77166221900136,lab:"JYOTISAR",urlid:"",ind:25, zLevel:12,ginfo: "https://goo.gl/maps/EsJQDDTqPVTBbvhB8"},
      {lat: 29.97959662785164, lng: 76.83130136065127,lab:"BHADRA KALI SHAKTI PITH",ind:25, zLevel:12,urlid:"",ginfo: "https://goo.gl/maps/Ns2k9mk3QEonKLif7"},
      {lat: 29.96364323650248, lng: 76.83148497403755,lab:"SRI VYAS GAUDIA MATH",ind:25, zLevel:12,urlid: "",ginfo: "https://goo.gl/maps/iLR612GQCKJTkcAA8"},
      {lat: 29.938811697439363,lng:  76.8125620263937,lab:"BHISHMA KUND",ind:25, zLevel:12,urlid:"",ginfo: "https://goo.gl/maps/EEMrMVbbNtDfGRBE9"},
      {lat: 29.981424653632715,lng:  76.82795848884643,lab:"STHANESHVAR MAHADEVA",ind:25, zLevel:12,urlid:"",ginfo: "https://goo.gl/maps/Bj3gyf4DdTU9v8wdA"},
  
  ];
  var jagannath = [
    {lat:19.806189567767962,lng: 85.81531003263105,lab:"JAGANNATH PURI",ind:35, zLevel:1,urlid:"#",ginfo:""},
    { lat: 20.36459605372617, lng: 85.19512904250497, lab: "NEEL MADHAVA TEMPLE",ind:25, zLevel:7, urlid: "https://en.wikipedia.org/wiki/Nilamadhav_Temple", ginfo: "https://goo.gl/maps/faysvKUyJE2wqWkv7" ,icon:"jagannatha.svg"},
 { lat: 19.948417424012028, lng: 85.80874835249067, lab: "SAKSHI GOPAL TEMPLE",ind:25, zLevel:7, urlid: "https://www.thegaudiyatreasuresofbengal.com/2022/01/22/the-story-of-sakshi-gopal-sakshi-gopal-temple/", ginfo: "https://goo.gl/maps/NVmmeez7pTMo3KYq6" ,icon:"jagannatha.svg"},
 { lat: 19.804953380932115, lng: 85.8179365300093, lab: "SRI JAGANNATH TEMPLE",ind:25, zLevel:3,  urlid: "https://www.shreejagannatha.in/", ginfo: "https://goo.gl/maps/di31XNWK9Bin9qtb7" ,icon:"jagannatha.svg"},
 
 //OTHER TEMPLES IN JAGANNATH PURI
 {lat:19.818421483522265, lng: 85.83077283523954, lab: "SIDDHA MAHAVIR",ind:25, zLevel:12,urlid:"https://iskcondesiretree.com/page/asta-mahavira-temples",ginfo:"https://goo.gl/maps/e3c6iYHavenbYUuN9"},
 { lat:19.804831735022976, lng: 85.81739130335657, lab: "KANAPATA MAHAVIR",ind:25, zLevel:12,urlid:"https://iskcondesiretree.com/page/asta-mahavira-temples",ginfo:"https://goo.gl/maps/w2GmrbAhPjitZJWH8"},
 { lat:19.803792122692997, lng: 85.81813845006495, lab: "VARGI HANUMAN",ind:25, zLevel:12,urlid:"https://iskcondesiretree.com/page/asta-mahavira-temples",ginfo:"https://goo.gl/maps/umkvND1nUAUbjqTVA"},
 { lat:19.803471383955646, lng: 85.84458259099841, lab: "BEDI HANUMAN",ind:25, zLevel:12,urlid:"https://iskcondesiretree.com/page/asta-mahavira-temples",ginfo:"https://goo.gl/maps/gS7Dj18NmLQdnakc8"},
 { lat:19.81997975583519, lng: 85.84196747887886, lab: "PANCH MUKHI HANUMAN",ind:25, zLevel:12,urlid:"https://iskcondesiretree.com/page/asta-mahavira-temples",ginfo:"https://goo.gl/maps/jMGrRCrvtHo2eow26"},
//TAPASVI HANUMAN NORTH GATE JAGANNATH PURI
//KAPAL MOCHAN MAHADEV
 { lat:19.803059984217185, lng: 85.8017751613693, lab: "SRI LOKANATH MAHADEV",ind:25, zLevel:12,urlid:"http://www.shreekhetra.com/lokanatha.html",ginfo:"https://goo.gl/maps/U1M21BMgWzjK2QwY8"},
  {lat:19.820164609143077, lng: 85.84183034612344, lab: "NILAKANTHESHVAR MAHADEV",ind:25, zLevel:12,urlid:"http://www.shreekhetra.com/nilakantheswar.html",ginfo:"https://goo.gl/maps/TSvGypZhqBiMh2Wv5"},
   {lat:19.798381836318075, lng: 85.81361147838335, lab: "YAMESHVAR MAHADEV",ind:25, zLevel:12,urlid:"http://puripolice.nic.in/?q=node/102",ginfo:"https://goo.gl/maps/8uCSKx7gaW4HmiSTA"},
 { lat:19.810347138807547, lng: 85.81497135902063, lab: "MARKANDESHVAR TEMPLE",ind:25, zLevel:12,urlid:"https://bhubaneswartourism.in/markandeshwar-temple-puri",ginfo:"https://goo.gl/maps/hEFS1WL9TQzVnn228"},
 { lat:19.81115132632744, lng: 85.81554747146801, lab: "MARKANDESHVAR POND",ind:25, zLevel:12,urlid:"#",ginfo:"https://goo.gl/maps/abHadb68Q7RQzGqV7"},
 { lat:19.811505874368894, lng: 85.82757840631103, lab: "MAUSI MAA TEMPLE",ind:25, zLevel:12,urlid:"https://thegaudiyatreasuresofbengal.com/2022/01/15/mausi-maa-temple-jagannath-puri/",ginfo:"https://goo.gl/maps/6y8PFSbixVyW6Gh7A"},
 { lat:19.792963176688364, lng: 85.81729046844474, lab: "SVARG DVAR",ind:25, zLevel:12,urlid:"http://www.shreekhetra.com/swargadwar.html",ginfo:"https://goo.gl/maps/j6djAjKKDu8TJJAx9"},
 { lat:19.801757654080284, lng: 85.81847768855269, lab: "SHVET-GABGA",ind:25, zLevel:12,urlid:"https://purimarkets.com/SwetagangaTank.aspx",ginfo:"https://goo.gl/maps/qgKtQcR2BubsTt3g7"},
  {lat:19.817454482631106, lng: 85.83998732136429, lab: "YAJNA-NRSIMHA TEMPLE",ind:25, zLevel:12,urlid:"http://www.shreekhetra.com/yagnanarasimha.html",ginfo:"https://goo.gl/maps/pYUcPo8uP3LwqNgh7"},
 //SRI VISHAKHA MATH
  { lat:19.84013633930243, lng: 85.83677316642502, lab: "BATA MANGALA TEMPLE",ind:25, zLevel:12,urlid:"#",ginfo:"https://goo.gl/maps/mK6J6JbcXtE9S39C6"},
 //{lat:19.818421483522265, lng: 85.83077283523954, lab: "ALAM CHANDI TEMPLE",ind:25, zLevel:12,urlid:"",ginfo:"https://goo.gl/maps/Hcc6SSfpbPj8cJpYA"},
 

 //TEMPLES RELATED TO LORD CAITANYA AND ASSOCIATES

 { lat:19.808190583840233,lng:85.82710385775103,lab:"AHULA MATH",ind:25, zLevel:12,urhttps:"//www.holydham.com/places-of-sri-gauranga-mahaprabhu-and-his-associates/lid:",ginfo:"https://goo.gl/maps/m63fsRz2gnC7P6328"},
 {lat:19.819749076601767,lng:85.831799854175,lab:"ATHARNALA BRIDGE",ind:25, zLevel:12,urlid:"https://www.holydham.com/places-of-sri-gauranga-mahaprabhu-and-his-associates/",ginfo:"https://goo.gl/maps/xZvukNuewbxYACYU6"},
 //DOUBT{lat:19.807212140314505,lng: 85.81122271701231,lab:"BALI MATH",ind:25, zLevel:12,urlid:"https://www.holydham.com/places-of-sri-gauranga-mahaprabhu-and-his-associates/",ginfo:"https://goo.gl/maps/mmwbKRQMhU8GAnfFA"},
 { lat:19.79335714887069,lng:85.8153163917649,lab:"ISKCON-BHAKTI KUTIR",ind:25, zLevel:12,urlid:"https://www.holydham.com/places-of-sri-gauranga-mahaprabhu-and-his-associates/",ginfo:"https://goo.gl/maps/gzLLEr34M7kvxvBV9"},
 { lat:19.808184879998322,lng:85.82230657421229,lab:"BIRTH PLACE-BHAKTI SIDDHANTA SARAWATI THAKUR PRABHUPADA",ind:25, zLevel:12,urlid:"https://www.holydham.com/places-of-sri-gauranga-mahaprabhu-and-his-associates/",ginfo:"https://goo.gl/maps/mnfcKBE6FMvKxJbt6"},
 { lat:19.796939007112737,lng:85.8134435827451,lab:"CHATAK PARVAT",ind:25, zLevel:12,urlid:"https://www.holydham.com/places-of-sri-gauranga-mahaprabhu-and-his-associates/",ginfo:"https://goo.gl/maps/BuBrU322vRjcCeKG9"},
 { lat:19.80043141336083,lng:85.81910572328704,lab:"GAMBHIRA",ind:25, zLevel:12,urlid:"https://www.holydham.com/places-of-sri-gauranga-mahaprabhu-and-his-associates/",ginfo:"https://goo.gl/maps/DmPa2kqk5ysLYj638"},
 {lat:19.816616916586234,lng:85.83960169341029,lab:"GUNDICHA MANDIR",ind:25, zLevel:12,urlid:"https://www.holydham.com/places-of-sri-gauranga-mahaprabhu-and-his-associates/",ginfo:"https://goo.gl/maps/mNxNu4RfVXekaXGU7"},
 {lat:19.792931454265652, lng:85.81504639107268,lab:"HARIDAS THAKUR SAMADHI",ind:25, zLevel:12,urlid:"https://www.holydham.com/places-of-sri-gauranga-mahaprabhu-and-his-associates/",ginfo:"https://goo.gl/maps/stQSg8yAhEDCfFCs6"},
 {lat:19.820888993435542, lng:85.84246243960911,lab:"INDRADYUMNA SAROVAR",ind:25, zLevel:12,urlid:"https://www.holydham.com/places-of-sri-gauranga-mahaprabhu-and-his-associates/",ginfo:"https://goo.gl/maps/UVvUxQQDkhg4iSKr7"},
 {lat:19.810039445994406, lng:85.82209315322346,lab:"JAGANNATH VALLABH GARDEN",ind:25, zLevel:12,urlid:"https://www.holydham.com/places-of-sri-gauranga-mahaprabhu-and-his-associates/",ginfo:"https://goo.gl/maps/M9pAEcMtZSJbXDVFA"},
 //MAHAPRABHU VISHRAM STHAN DOUBT
 {lat:19.813151029617217, lng:85.82496352332943,lab:"NARENDRA SAROVAR",ind:25, zLevel:12,urlid:"https://www.holydham.com/places-of-sri-gauranga-mahaprabhu-and-his-associates/",ginfo:"https://goo.gl/maps/PwJF35PQQZKuDSuR8"},
{lat: 19.804415446842672,lng:85.80777176290249,lab:"PARAMANANDA PURI KUA",ind:25, zLevel:12,urlid:"https://www.holydham.com/places-of-sri-gauranga-mahaprabhu-and-his-associates/",ginfo:"https://goo.gl/maps/tZSGiVHEGDAjjgyn6"},
 {lat:19.801085406973286,lng:85.8183427114325,lab:"SARVABHAUMA BHATTACHARYA HOUSE",ind:25, zLevel:12,urlid:"https://www.holydham.com/places-of-sri-gauranga-mahaprabhu-and-his-associates/",ginfo:"https://goo.gl/maps/LKzsFVZaR6HZN7su9"},
 //SATASANA MATH NEXT TO ISKCON TEMPLE WHERE SAPTA RISHIS PERFORMED TAPASYA
  {lat:19.799760438831886,lng:85.81996068604796,lab:"SIDDHA BAKULA",ind:25, zLevel:12,urlid:"https://www.holydham.com/places-of-sri-gauranga-mahaprabhu-and-his-associates/",ginfo:"https://goo.gl/maps/t7S4cVebugXSW5jK6"},
 {lat:19.797427306108737 ,lng:85.81295935095612,lab:"TOTA GOPINATH",ind:25, zLevel:12,urlid:"https://www.holydham.com/places-of-sri-gauranga-mahaprabhu-and-his-associates/",ginfo:"https://goo.gl/maps/e5vrQWz4debM7bLYA"},
 
 ];



  window.initMap = initMap;