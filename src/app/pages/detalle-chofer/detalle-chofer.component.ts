import { FirebaseService } from './../../service/firebase.service';
import { Component, OnInit, ɵConsole } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartType } from 'chart.js';
import { FunctionsService } from 'src/app/service/functions.service';
import swal from 'sweetalert';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbDateCustomParserFormatter } from 'src/app/service/dateformat.service';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDeleteComponent } from 'src/app/components/modal-delete/modal-delete.component';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-detalle-chofer',
  templateUrl: './detalle-chofer.component.html',
  styleUrls: ['./detalle-chofer.component.css']
})
export class DetalleChoferComponent implements OnInit {

  public doughnutChartLabels: any[] = ['Aceptados', 'Rechazados', 'Perdidos', 'Cancelado por el pasajero', 'Cancelado por el chofer'];
  public doughnutChartData: any = [550, 150, 100, 10, 12];
  public doughnutChartType: ChartType = 'doughnut';
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
  };
  cargandoimagen: boolean = true; 
  public forma:FormGroup;
  vehiculoSeleccionado: boolean = false;
  title_vehiculos:string ="Crear Vehículo"
  dateNac:any;
  fecha:string;
  private _observableSubscriptions: Subscription[] = [];

  modelos=[];
  marcas = ["AUDI","BMW","CHEVROLET","CHRYSLER","DODGE","FIAT","FORD","HONDA","HYUNDAI","JEEP","KIA","MAZDA","MITSUBISHI","NISSAN","PEUGEOT","SEAT","TOYOTA","VOLKSWAGEN"];
  Audi = ["100","200","4000","500","60","80","90","A1","A1 SPORTBACK","A2","A3","A3 SPORTBACK","A4","A4 ALLROAD QUATTRO","A5","A5 SPORTBACK","A6","A6 ALLROAD QUATTRO","A7 SPORTBACK","A8","CABRIOLET","COUPE","Q2","Q3","Q5","Q7","Q8","QUATTRO","R8","RS Q3","RS2","RS3","RS3 SPORTBACK","RS4","RS5","RS5 SPORTBACK","RS6","RS7 SPORTBACK","S1","S1 SPORTBACK","S2","S3","S3 SPORTBACK","S4","S5","S5 SPORTBACK","S6","S7 SPORTBACK","S8","SPORT QUATTRO","SQ2","SQ5","SQ7","TT","TT RS","TTS","TTS RS","V8"];
  BMW=["1502","1600","1602","1800","1802","2000","2002","2500","2800","3.0","315","501","502","600","700","I3","I8","ISETTA","M1","SERIE 1","SERIE 2","SERIE 3","SERIE 4","SERIE 5","SERIE 6","SERIE 7","SERIE 8","X1","X2","X3","X4","X5","X6","X7","Z1","Z3","Z4","Z8"];
  Chevrolet = ["3100","AD","ADVANCE DESING","ALERO","APACHE 31","ASTRA","ASTRO","AVALANCHE","AVEO","BEAUVILLE","BEL AIR","BERETTA","BLAZER","C","C-10","C-30","CAMARO","CAPRICE","CAPTIVA","CAPTIVA SPORT","CAVALIER","CELEBRITY","CENTURY","CHAMPION","CHEVELLE","CHEVETTE","CHEVY 3600","CHEVY II","CHEVY MONZA","CHEVY VAN","CHEYENNE","CITATION","COACH","COBALT","COBRA","COLORADO","CONFEDERATE","CORSICA","CORVAIR","CORVETTE","CRUZE","CUSTOM","DAYTONA","DESANDE","EL CAMINO","EPICA","EQUINOX","EVANDA","EXPLORER","EXPRESS EXPLORER","EXPRESS VAN 1500","FLEETLINE AERO","GEO METRO","GEO STORM","GEO TRACKER","GP 3100","HHR","IMPALA","INDEPENDENCE","INTERNACIONAL","K-14","K-20","KALOS","LACETTI","LQ","LUMINA","LUV","MALIBU","MASTER SEDAN","MASTER SERIES","MATIZ","MONTECARLO","MONZA","MPV","NATIONAL AB","NOVA","NUBIRA","ORLANDO","PHAETON","PICK UP","SEDAN","SERIES V","SILVERADO","SONIC","SPARK","SPECIAL DELUXE","SPRINT","SSR","STANDARD SERIES","STARCRAFT","STEPVAN","STYLEMASTER","STYLINE DELUXE","SUBURBAN","TACUMA","TAHOE","THRIFTMASTER","TRACKER","TRAILBLAZER","TRANS SPORT","TRAVERSE","TRAX","TYPHOON","UNIVERSAL","VAN 20","VAN CUSTOM","VANDURA","VEGA","VENTURE","VITARA","VOLT","YUKON"];
  Chrysler = ["SEBRING","300C","PT CRUISER","VOYAGER","CROSSFIRE", "TOWN & COUNTRY"];
  Dodge=["400","600","1500","3700","ARIES","ASPEN","ATTITUDE","AVENGER","CALIBER","CARAVAN","CHALLENGER","CHARGER","CHARGER (B-BODY)","CHARGER (LX)","CHEROKEE","COLT","CORONADO","CORONET","DART","DART GT","DAKOTA","DAYTONA","DIPLOMAT","DURANGO","DYNASTY","GTX","INTREPID","JOURNEY","LANCER","MAGNUM","MIRADA","MONACO","NEON SRT-4","NITRO","OMNI","POLARA","RAM SRT 10","RAMCHARGER","RAM PICKUP","TOWN & COUNTRY","SPIRIT","STRATUS","SUPER BEE","VIPER"];
  Fiat= ["1100","1200","124","124 SPIDER","125","126","127","128","130","1300","131","132","1400","1500","1900","2300","238","242","500","500C","500L","500L LIVING","500L WAGON","500X","501","503","508 BALILLA","509","514","60","600","616","618","625","65","850","900 T","ALBEA","ARGENTA","BARCHETTA","BRAVA","BRAVO","CAMPAGNOLA","CINQUECENTO","COUPE","CROMA","D 25","DINO","DOBLO","DOBLO CARGO","DUCATO","DUNA","F 13","F8","FIORINO","FREEMONT","FULLBACK","IDEA","LINEA","MAREA","MULTIPLA","PALIO","PANDA","PUNTO","PUNTO EVO","QUBO","REGATA","RITMO","SCUDO","SEDICI","SEICENTO","SERIE CX","SPIDER","STILO","STRADA","TALENTO","TEMPRA","TIPO","TOPOLINO","ULYSSE","UNO"];
  Ford = ["17 M", "A", "AA", "AEROSTAR", "ANGLIA", "ASPIRE", "B", "B-MAX", "BRANTON", "BRONCO", "BRONCO II", "C-MAX", "CAPRI", "COBRA", "CONNECT", "CONQUISTADOR", "CONSUL", "CONTOUR", "CORSAIR", "CORTINA", "COUGAR", "COUPE CLUB", "COURIER", "CRESTLINE", "CROWN VICTORIA", "CUSTOM", "CUSTOM TOURNEO", "E 350", "E 50", "ECONOLINE", "ECONOLINE 150", "ECONOLINE 240", "ECONOLINE 350", "ECONOVAN", "ECOSPORT", "EDGE", "EIFEL", "ESCAPE", "ESCORT", "EXCURSION", "EXPEDITION", "EXPLORER", "F 100", "F 150", "F 250", "F 350", "FAIRLANE 500", "FAIRMONT", "FALCON", "FESTIVA", "FIESTA", "FIVE HUNDRED", "FLEX", "FOCUS", "FOCUS C-MAX", "FOCUS CC", "FREDA", "FUSION", "GALAXIE", "GALAXY", "GPW", "GRAN TORINO", "GRANADA", "GRAND C-MAX", "GT", "GT40", "HORNET", "KA", "KA+", "KUGA", "LANDAU", "LASER", "LOBO", "LTD", "LTD CROWN VICTORIA", "MAMUT", "MARK VIII", "MAVERICK", "MODEL 40", "MONDEO", "MUSTANG", "NAVIGATOR", "ORION", "PHAETON", "PICK UP", "PREFECT", "PROBE", "PUMA", "RANCHERO", "RANGER", "RS 200", "S-MAX", "SCORPIO", "SIERRA", "SUPER DELUXE", "T", "TAUNUS", "TAURUS", "TEMPO", "THUNDERBIRD", "TOPAZ", "TORINO", "TOURNEO CONNECT", "TOURNEO COURIER", "TRANSIT", "TRANSIT 2", "TRANSIT CONNECT", "TRANSIT COURIER", "TT", "V8", "VEDETTE", "WINDSTAR", "Y", "ZEPHYR","ZODIAC"];
  Honda=["ACCORD","CITY","CIVIC","CIVIC TOURER","CONCERTO","CR-V","CR-Z","CROSSTOUR","CRX","ELEMENT","FIT","FR-V","HR-V","INSIGHT","INTEGRA","JAZZ","JAZZ ATV","LEGEND","LOGO","MONPAL","NSX","ODYSSEY","ODYSSEY-SHUTTLE","PILOT","PRELUDE","QUINT INTEGRA","QUINTET","RIDGELINE","S 2000","S 800","SHUTTLE","STEPWGN","STREAM","TN","TN ACTY","VIGOR","Z"];
  Hyundai= ["ACCENT","ATOS","CENTENNIAL","COUPE","CRETA","ELANTRA","EQUUS","EXCEL","GANDEUR","GENESIS","GETZ","GRACE","GRAND SANTA FE","GRANDEUR","H 200","H 350","H-1","H-1 TRAVEL","H-1 VAN","H-100","I10","I20","I20 ACTIVE","I30","I30 FASTBACK","I40","I800","I800 VAN","IONIQ","IX 20","IX 35","IX 55","KONA","LANTRA","MARCIA","MATRIX","MAXIVAN","NEXO","PONY","PORTER","SANTA FE","SATELLITE","SCOUPE","SOLARIS","SONATA","STELLAR","TERRACAN","TRAJET","TUCSON","VELOSTER","XG"];
  Jeep=["CHEROKEE","COMPASS","GRAND CHEROKEE","RENEGADE","WRANGLER","WRANGLER UNLIMITED"];
  Kia=["BESTA","CARENS","CARNIVAL","CEED","CEED TOURER","CERATO","CERES","CLARUS","E-NIRO","ELAN","FORTE","FRONTIER","JOICE","K 2700","K2500","K2900","LEO","MAGENTIS","MENTOR","NIRO","OPIRUS","OPTIMA","PICANTO","PREGIO","PRIDE","PROCEED","RETONA","RIO","SEDONA","SEPHIA","SEPHIA II","SHUMA","SORENTO","SOUL","SPECTRA","SPORTAGE","STINGER","STONIC","VENGA"];
  Mazda=["121","323","616","626","808","818","929","B","BONGO","BT-50","CX-3","CX-5","CX-7","CX-9","DEMIO","E 2000","E 2200","ECONOVAN","KCA BUS","MAZDA2","MAZDA3","MAZDA5","MAZDA6","MPV","MX-3","MX-5","MX-6","NAVAJO","PREMACY","PROBE","PROTEGE","RX-2","RX-4","RX-7","RX-8","T 2500","TRIBUTE","XEDOS 6","XEDOS 9"];
  Mitsubishi=["3000 GT","ALLEY","ASX","CANTER","CANTER FB","CANTER FE","CARISMA","CELESTE","COLT","CORDIA","DELICA","DELICIA","DIAMANTE","DODGE STEALTH","EAGLE TALON","ECLIPSE","ECLIPSE CROSS","ENDEAVOR","EXPO","FTO","GALANT","GALANT SIGMA","GRANDIS","GTO","I-MIEV","J 54","L 200","L 300","L 400","LANCER","MIRAGE","MONTERO","MONTERO IO","MONTERO SPORT","NATIVA","OUTLANDER","PAJERO","PAJERO PININ","PICK UP","SAPPORO","SHOGUN","SHOGUN PININ","SHOGUN SPORT","SIGMA","SPACE GEAR","SPACE RUNNER","SPACE STAR","SPACEWAGON","SPYDER","STARION","TREDIA","VALLEY"];
  Nissan=["100 NX","200 SX","240 SX","280 ZX","300 ZX","350 Z","370 Z","4W60","ALMERA","ALMERA CLASSIC","ALMERA TINO","ALTIMA","ARMADA","ATLEON","BLUEBIRD","CABSTAR","CABSTAR E","CEDRIC","CHERRY","CUBE","E 1000","E 35","E 350","E 60","E-NV200","ECO-T","ELGRAND","EVALIA","F 108","F 260","F 275","F 350","FAIR LADY","FIGARO","FRONTIER","GT-R","INFINITI","INTERSTAR","IUBIZE","JUKE","KING","KUBISTAR","L","L-35.08","L-35.09","LARGO","LAUREL","LEAF","MAXIMA","MAXIMA QX","MICRA","MISTRAL","MURANO","NAVARA","NOTE","NP300","NP300 NAVARA","NT400","NT400 CABSTAR","NT500","NV 200","NV 300","NV 400","PATHFINDER","PATROL","PATROL GR","PICK UP","PIXO","PRAIRIE","PRIMASTAR","PRIMERA","PULSAR","QASHQAI","QASHQAI+2","QUEST","ROGUE","SENTRA","SERENA","SILVIA","SKYLINE","STANZA","SUNNY","TEANA","TERRANO","TERRANO II","TIIDA","TITAN","TRADE","TSURU","URVAN","VANETTE","VERSA","X-TERRA","X-TRAIL"];
  Toyota=["1000","4RUNNER","AVANZA","ALPHARD","ALTEZZA","AURIS","AVALON","AVENSIS","AYGO","C-HR","CAMRY","CARINA E","CARINA II","CELICA","COROLLA","CORONA","CRESSIDA","CROWN","DYNA","DYNA 100","DYNA 150","DYNA 200","DYNA 300","ECHO","ESTIMA","F","FJ CRUISER","FORTUNER","FUN CARGO","GR SUPRA","GRANVIA","GT86","HIACE","HIGHLANDER","HILUX","HILUX SURF","IQ","LAND CRUISER","LAND CRUISER 200","LAND CRUISER LARGE","LITE ACE","LUCIDA","MATRIX","MEGA CRUISER","MODEL F","MR2","PASEO","PICK UP","PICNIC","PREVIA","PRIUS","PRIUS+","PROACE","PROACE VERSO","R 2G","RACTIS","RAV4","SAMURAI","SCION","SEQUOIA","SERA","SIENNA","STARLET","SUPRA","SW4","T 100","TACOMA","TERCEL","TOWN ACE","TRUENO","TUNDRA","URBAN CRUISER","VENZA","VERSO","VERSO S","YARIS"];
  Volkswagen=["1500","1600","18","22","251","411","AMAROK","ARTEON","ATLANTIC","BEETLE","BESTEL","BORA","BRASILIA","BUS","CADDY","CADDY MAXI","CALIFORNIA","CARAVELLE","CC","COCCINELLE","COMBI","CORRADO","CRAFTER","CROSSFOX","CROSSGOLF","CROSSPOLO","CROSSTOURAN","DASHER","DERBY","EOS","ESCARABAJO","EUROVAN","FOX","FURGONETA","FUSCA","GOL","GOLF","GOLF ALLTRACK","GOLF PLUS","GOLF SPORTSVAN","ILTIS","JETTA","K 70","KAFER","KARMANN","KEVER","KLEINBUS","KUBEL","LT","LT40","LT45","LUPO","MICROBUS","MULTIVAN","NEW BEETLE","PARATI","PASSAT","PASSAT ALLTRACK","PASSAT CC","PHAETON","POLO","QUANTUM","RABBIT","ROUTAN","SAFARI","SANTANA","SCIROCCO","SHARAN","SP2","SPEEDSTER","SPORTSVAN","T-CROSS","T-ROC","T1","TARO","TC","TIGUAN","TIGUAN ALLSPACE","TIPO 2","TIPO 3","TIPO 4","TIPO 7","TOUAREG","TOURAN","TRANSPORTER","TRANSPORTER 2010","TRANSPORTER 2015","UP","VANAGON","VENTO","XL1"];
  Peugeot = ["1007","104","106","107","108","109","163","172","190","2008","201","202","203","204","205","206","206 +","207","207 CC","208","3008","301","302","304","305","306","307","308","309","4007","4008","401","402","403","404","405","406","407","408","5008","504","504 V","505","508","604","605","607","806","807","BIPPER","BOXER","D4B","DALLAS","EXPERT","ION","J-5","J-7","J-9","P4","PARTNER","PARTNER ORIGIN","RCZ","RIFTER","TRAVELLER"];
  Seat=["1200","124","127","128","131","132","133","1400","1430","1500","1800","2000","600","800","850","ALBA-PANDA","ALHAMBRA","ALTEA","ALTEA FREETRACK","ALTEA XL","ARONA","AROSA","ATECA","CORDOBA","EXEO","FURA","IBIZA","IMESA","INCA","LEON","LEON X-PERIENCE","MALAGA","MARBELLA","MII","OZZA","PANDA","RITMO","RONDA","TARRACO","TERRA","TOLEDO","TRANS"];
  


  chofer = {
    "activo": false,
    "apellidos": "",
    "autorizado": false,
    "concesion": "",
    "concesiones_que_trabaja": [],
    "correo": "",
    "etiqueta": "",
    "fechaNacimiento": "",
    "fechaRegistro": "",
    "folio": "",
    "genero": "",
    "img": "",
    "nombre": "",
    "propietarioVehiculo": "",
    "telefono": "",
    "uid": "",
    "uidUserSystem": "",
  };
  user: any;
  uid:string;
  vehiculosRegistrados: any [] = [];
  correo: string;
  habilitado: boolean ;
  public loading = false;
  calificaciones = {
    'excelente': 3713,
    'muybueno': 742,
    'bueno': 247,
    'malo': 148,
    'pesimo':120
  }

  imgDefault: string;
  listComentarios: any[] = [];

  public minDate: any;
  public maxDate: any;
  public startDate: any;


  icons: string[] =
  ['mdi mdi-emoticon-sad',
   'mdi mdi-emoticon-neutral',
   'mdi mdi-emoticon-happy',
   'mdi mdi-emoticon',
   'mdi mdi-emoticon-cool'];

  rating: string[] = ['Pésimo', 'Malo', 'Normal', 'Muy bueno', 'Excelente'];
  meses: string[] = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  constructor(private route: ActivatedRoute,
    private servicioNode: FunctionsService,
    private sFormat: NgbDateCustomParserFormatter,
    private modalService: NgbModal,
    private servicioFirebase: FirebaseService) {
    this.imgDefault = 'https://firebasestorage.googleapis.com/v0/b/directtaxi-prod.appspot.com/' +
    'o/imgDefault.png?alt=media&token=e65da24c-3355-4327-8e4f-d9c177564f47';
    this.chofer.uid = this.route.snapshot.paramMap.get('uid');
    this.user=  JSON.parse(localStorage.getItem('user'));
    this.uid = localStorage.getItem('uid');
    this.obtenerInfoChofer(this.chofer.uid);

    this.forma = new FormGroup({
      'idVehiculo':         new FormControl(),
      'marca':           new FormControl('', Validators.required),
      'modelo':          new FormControl('', Validators.required),
      'matricula':          new FormControl('', Validators.required),
      'anio':          new FormControl('', Validators.required),
      'capacidad':          new FormControl('-1', Validators.required),
      'conRampa':          new FormControl('', Validators.required),
      'concesion':          new FormControl('', [Validators.required, Validators.maxLength(3), Validators.max(900), Validators.min(1)]),
    });
    
  }

  ngOnInit() {
  }

  obtenerInfoChofer(uid: string) {
    const s = this.servicioFirebase.buscarInfoChofer(uid)
        .subscribe((data:any) => {
          this.chofer = data;
          this.minDate = {year: 1930, month: 1, day: 1};
          this.maxDate = {year: 2010, month: 1, day: 1};

          let arrayDia = (this.chofer.fechaNacimiento).split("º");
          let dia = parseInt(arrayDia[0]);

          let arrayMes = (arrayDia[1]).split(",");
          let mes = this.meses.indexOf((arrayMes[0].trim())) + 1 ;
          let anio = parseInt(arrayMes[1].trim());
          this.dateNac = {
             year:anio, month: mes, day: dia
           }
           this.fecha = this.sFormat.format(this.dateNac);
           this.startDate  = this.dateNac;
          
          setTimeout(() => {
            this.cargandoimagen = false;            
          });
          this.habilitado = this.chofer.autorizado;
          this.correo = this.chofer.correo;
          this.obtenerVehiculos(this.chofer.uid);
        });
    this._observableSubscriptions.push(s);
    
    const c = this.servicioFirebase.buscarComentariosChoferes(uid)
        .subscribe((data: any) => {
          this.listComentarios = [];
          for (let i = 0; i < data.length; i++) {
            if (data[i].comentario !== '') {
              data[i].emoji = {
                icon: this.icons[data[i].calificacion - 1 ],
                rating : this.rating[data[i].calificacion - 1 ],
              }
              data[i].imgPasajero =  data[i].imgPasajero === 'sin imagen' ? this.imgDefault : data[i].imgPasajero;
              this.listComentarios.push(data[i]);
            }
          }
        });
    this._observableSubscriptions.push(c);    
  }

  updateDateNac(data){
    this.fecha = this.sFormat.format(data);
  }

  obtenerVehiculos(idChofer: string){
   const v = this.servicioFirebase.buscarInfoVehiculoFijosChofer(idChofer)
       .subscribe((vehiculos: any)=>{
      this.vehiculosRegistrados = [];
      vehiculos.forEach(vehiculo => {
        this.vehiculosRegistrados.push(vehiculo);
      });
     });
   this._observableSubscriptions.push(v);
  }

  cambiarStatusChofer(){
    this.habilitado = !this.habilitado;
    this.loading = true;
    const obj = {
      'uid': this.chofer.uid,
      'disabled': this.chofer.autorizado,
      'correo': this.chofer.correo,
      "uidUserSystem":this.user.nombre ,
      "nombreUserSystem": this.user.nombre,
      "imgUserSystem": this.user.img
    }

    this.servicioNode.cambiarEstatusChofer(obj).subscribe(data=>{
      this.loading = false;
      if(data){
        const mensaje =  this.chofer.autorizado? 'deshabilitado': 'habilitado';
        swal('Correcto!', 'Se ha ' +mensaje+  ' el chofer correctamente', 'success')
        .then(()=>{
          this.chofer.autorizado = this.habilitado;
          if(!this.habilitado){
            this.chofer.activo = false;
          }
        })
      }
    });
  }

  reestablecerPassword(){
    this.loading = true;
    const obj = {
      'uidChofer': this.chofer.uid,
      'uidUserSystem': this.uid,
      'nombre':this.user.nombre ,
      'img': this.user.img,
      'correo': this.correo,
      'dataChofer': this.chofer, 
      'dataVehiculos': this.vehiculosRegistrados
    }
    this.servicioNode.reestablecerPassword(obj).subscribe(data=>{
      this.loading = false;
      if(data){
        swal('Correcto!', 'Se ha reenviado la información de registro nuevamente', 'success')
      }
    });
  }

  editarChofer(){
    this.loading = true;
    const dataChofer = {
      uid: this.chofer.uid,
      nombre: this.chofer.nombre,
      apellidos: this.chofer.apellidos,
      telefono: this.chofer.telefono,
      correo: this.chofer.correo,
      folio: this.chofer.folio,
      genero: this.chofer.genero,
      fechaNacimiento: this.fecha,
      'uidUserSystem': this.uid,
      'nombreSystem':this.user.nombre ,
      'imgSystem': this.user.img,
    }

    console.log(dataChofer)
     this.servicioNode.editarChofer(dataChofer).subscribe((data: any)=>{
       this.loading = false;
       if(data.commit){
         swal('Correcto!', 'Información modificada correctamente', 'success')
       }
     });
  }

  seleccionVehiculo(item){
    this.title_vehiculos = 'Editar Vehículo'
    this.vehiculoSeleccionado = true;
    this.forma.controls['idVehiculo'].setValue(item.idVehiculo);
    this.forma.controls['marca'].setValue(item.marca);
    this.forma.controls['modelo'].setValue(item.modelo);
    this.forma.controls['anio'].setValue(item.anio);
    this.forma.controls['capacidad'].setValue(item.capacidad);
    this.forma.controls['concesion'].setValue(item.concesion);
    // this.forma.controls['modalidad'].setValue(item.modalidad);
    this.forma.controls['matricula'].setValue(item.matricula);
    this.forma.controls['conRampa'].setValue(item.conRampa);
  }

  editarVehiculo(){
    console.log(this.forma.value);
    this.loading = true;
    const dataVehiculo = {
      idVehiculo: this.forma.value.idVehiculo,
      marca: this.forma.value.marca,
      modelo: this.forma.value.modelo,
      anio: this.forma.value.anio,
      capacidad: this.forma.value.capacidad,
      matricula: this.forma.value.matricula,
      conRampa: this.forma.value.conRampa,
      concesion: this.forma.value.concesion,
      'uidUserSystem': this.uid,
      'nombreSystem':this.user.nombre ,
      'imgSystem': this.user.img,
    }

    this.servicioNode.editarVehiculo(dataVehiculo).subscribe((data: any)=>{
      this.loading = false;
      this.forma.reset();
      this.vehiculoSeleccionado = false;
      if(data.commit){
        swal('Correcto!', 'Información modificada correctamente', 'success').then(()=>{
          this.obtenerVehiculos(this.chofer.uid)
          this.cancelarVehiculo();
        })
      }
    });

  }

  eliminarVehiculo(){
    console.log(this.forma.value);
    const modalRef = this.modalService.open(ModalDeleteComponent);
    modalRef.componentInstance.item = this.forma.value;
    modalRef.componentInstance.collection = 'choferes';
    modalRef.result.then((data)=>{
      if(data){
       this.obtenerVehiculos(this.chofer.uid)
       this.cancelarVehiculo()
      }
    }).catch(err=>{
      console.log(err)
    });
    
  }


  selectEvent(item) {
    console.log(item);
    switch (item) {
      case "AUDI":
      this.modelos = this.Audi;
      break;
      case "BMW":
      this.modelos = this.BMW;
      break;
      case "CHEVROLET":
      this.modelos = this.Chevrolet;
      break;
      case "CHRYSLER":
      this.modelos = this.Chrysler;
      break;
      case "DODGE":
      this.modelos = this.Dodge;
      break;
      case "FIAT":
      this.modelos = this.Fiat;
      break;
      case "FORD":
      this.modelos = this.Ford;
      break;
      case "HONDA":
      this.modelos = this.Honda;
      break;
      case "HYUNDAI":
      this.modelos = this.Hyundai;
      break;
      case "JEEP":
      this.modelos = this.Jeep;
      break;
      case "KIA":
      this.modelos = this.Kia;
      break;
      case "MAZDA":
      this.modelos = this.Mazda;
      break;
      case "MITSUBISHI":
      this.modelos = this.Mitsubishi;
      break;
      case "NISSAN":
      this.modelos = this.Nissan;
      break;
      case "PEUGEOT":
      this.modelos = this.Peugeot;
      break;
      case "SEAT":
      this.modelos = this.Seat;
      break;
      case "TOYOTA":
      this.modelos = this.Toyota;
      break;
      case "VOLKSWAGEN":
      this.modelos = this.Volkswagen;
      break;
  }
  }

  focusModelo(){
    if(this.forma.value){
      this.selectEvent(this.forma.value.marca)
    }
  }


  crearVehiculo(){
     this.loading = true;
      let obj ={
        'vehiculo':{
          anio: this.forma.value.anio,
          capacidad: this.forma.value.capacidad,
          conRampa: this.forma.value.conRampa,
          concesion: this.forma.value.concesion,
          idVehiculo: null,
          marca: this.forma.value.marca,
          matricula: (this.forma.value.matricula).toUpperCase(),
          modelo: this.forma.value.modelo,
        },
        'chofer':{
          'nombre': this.chofer.nombre, 
          'apellidos': this.chofer.apellidos, 
          'folio': this.chofer.folio, 
          'img': this.chofer.img, 
          'uid': this.chofer.uid, 
          'genero': this.chofer.genero,
          'concesiones_que_trabaja': this.chofer.concesiones_que_trabaja
        }
      }
       this.servicioNode.crearVehiculo(obj).subscribe((data: any)=>{
         this.loading = false;
         this.forma.reset();
         this.vehiculoSeleccionado = false;
         if(data.commit){
           swal('Correcto!', 'Vehículo guardado correctamente', 'success').then(()=>{
             this.obtenerVehiculos(this.chofer.uid)
             this.cancelarVehiculo();
           })
         }
       });

  }

  cancelarVehiculo(){
    this.title_vehiculos = "Crear Vehículo";

    this.forma.controls['idVehiculo'].setValue('');
    this.forma.controls['marca'].setValue('');
    this.forma.controls['modelo'].setValue('');
    this.forma.controls['anio'].setValue('');
    this.forma.controls['capacidad'].setValue('-1');
    this.forma.controls['concesion'].setValue('');
    this.forma.controls['matricula'].setValue('');
    this.forma.controls['conRampa'].setValue('');
  }

  ngOnDestroy() {
    this._observableSubscriptions.forEach((s) => {
      s.unsubscribe();
      console.log('dessuscrito')
    });
  }
  

}