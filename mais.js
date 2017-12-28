 //set up the modification tools


 function showMsg(szMessage) {
 document.getElementById("message").innerHTML = szMessage;
 setTimeout(
 "document.getElementById('message').innerHTML = ''",2000);
 }

 function showSuccessMsg(){
 showMsg("<font color='white'>Transaction successfully completed</font>");
 };
 
 function showFailureMsg(){
 showMsg("An error occured while operating the transaction");
 };
 
 var saveStrategy = new OpenLayers.Strategy.Save();
		saveStrategy.events.register("success", '', showSuccessMsg);
		saveStrategy.events.register("failure", '', showFailureMsg);

		var map;
		var nitrogen;
		var phosphat;
		var mais_anbau;
		var mais_ertrag;
		var grenzen;
		var wasser;
		var n_P;
		var pRadius1 = "${_2010}";
		var pRadius2 = "${anteil_2010}";
		var pRadius2a = "anteil_2010";
		var pRadius3 = "${_2010_}";
		var werte;
		var rule_n;
		var rule_temp_n;
		var rule_temp_p;
		var rule_temp_n_p;
		var rule_temp_anbau;
		var rule_temp_ertrag;
		var rule_p;
		var rule_n_P;
		var rule_wasser;
		var rule_anbau;
		var rule_ertrag;
		var smallMap;
		

 function pRadius(clicked_id) {
		    pRadius1 = '${' + clicked_id + '}';
		    pRadius2 = '${anteil' + clicked_id + '}';
		    pRadius2a = 'anteil' + clicked_id;
		    console.log(pRadius2a);
		    pRadius3 = '${' + clicked_id + '_}';
		    rule_n.symbolizer.pointRadius = pRadius1;
		    rule_temp_n.symbolizer.label = pRadius1;
		    rule_p.symbolizer.pointRadius = pRadius1;
		    rule_temp_p.symbolizer.label = pRadius1;
		    rule_n_P.symbolizer.pointRadius = pRadius1;
		    rule_temp_n_p.symbolizer.label = pRadius1;
		            //rule_wasser.symbolizer.pointRadius = pRadius1;
		    //rule_anbau.symbolizer.pointRadius = pRadius2;
		    rule_temp_anbau.symbolizer.label = pRadius2;
		    rule_ertrag.symbolizer.pointRadius = pRadius3;
		    rule_temp_ertrag.symbolizer.label = pRadius3;
     //update layers
		    nitrogen.redraw();
		    phosphat.redraw();
		    n_P.redraw();
		    // wasser.redraw();
		    mais_ertrag.redraw();
		    mais_anbau.redraw();
 }
 
 function init() {
   
       //set up a save strategy

   var WGS84_google_mercator = new OpenLayers.Projection("EPSG:3857");  
   var WGS84 = new OpenLayers.Projection("EPSG:4326");  
   //var DHDN_3_Degree_Gauss_Zone_4 = new OpenLayers.Projection("EPSG:31468"); 
   
  var mapextent =  new OpenLayers.Bounds(21.9993705749513,-26.8686943054198, 63.5034713745121, 18.0067138671877).transform (WGS84, WGS84_google_mercator);
  var mapextent2 = new OpenLayers.Bounds(23, -20, 50, 13).transform(WGS84, WGS84_google_mercator);
  var mapextent3 = new OpenLayers.Bounds(22, -26, 63, 18).transform(WGS84, WGS84_google_mercator);
		 map = new OpenLayers.Map ("basicMap", {    
			 controls:[
			 // allows the user pan ability
			 new OpenLayers.Control.Navigation(),
			// displays the pan/zoom tools                    
			 new OpenLayers.Control.PanZoom(),
			 //displays a layer switcher
			 new OpenLayers.Control.LayerSwitcher()
			 ],			 
			 projection: WGS84_google_mercator,
			 allOverlays: true,
			 maxExtent: mapextent
		 } );
		 setTimeout(plotScale, 100);
		 function plotScale(){
	var plotscale = map.getScale();
	var roundedscale = Math.round(plotscale/1000000)*1000000;
	console.log("Scale: ",roundedscale );
	document.getElementById("scale").innerHTML= "<br> <b>Maßstab:</b> 1:" + roundedscale;
	}
	
	//LAYERS	
		var mapnik = new OpenLayers.Layer.OSM();
		mapnik.setVisibility(false);

	
		//GRENZEN
		var style_grenzen = new OpenLayers.Style();
		var rule_grenzen = new OpenLayers.Rule ({
				symbolizer: {
							   fillOpacity: 0,
							   fillColor: "#302B2B",
							   strokeColor: "#865D47",
							   strokeWidth: 2,
							   
							   
				}
							   });
		var temporaryStyle =  new OpenLayers.Style({
		    strokeColor: "#D5Ae90",
		    strokeWidth: 1,
            strokeOpacity: 0.7,
            fillColor: "#c",
            fillOpacity: 0.1,
            cursor: "pointer",
            label: "${name_0}",
            fontFamily: "Verdana",
            fontColor: "#865D47",
            labelOutlineWidth: 0,
            labelXOffset: -10,
            labelYOffset: 10,
        });
        var selectStyle = new OpenLayers.Style({
            strokeColor: "#D5AE90",
            strokeOpacity: .7,
            strokeWidth: 2,
            fillColor: "#151515",
            fillOpacity: 0.1,
            graphicZIndex: 2,
            cursor: "pointer",
            //label: "${name_0}",
        });
		style_grenzen.addRules([rule_grenzen]);
		var stylem_grenzen = new OpenLayers.StyleMap({
		"default": style_grenzen,
		"temporary": temporaryStyle,
		"select": selectStyle		
		});					   
						   
		grenzen = new OpenLayers.Layer.Vector("Grenzen", {
				 styleMap: stylem_grenzen,
				 strategies: [new OpenLayers.Strategy.BBOX() , saveStrategy ],
				 projection: WGS84,
				 protocol: new OpenLayers.Protocol.WFS({
					 version: "1.0.0",
					 url: "http://localhost:8080/geoserver/wfs",
					 featureNS: "http://www.opengeospatial.net/cite",
					 maxExtent: mapextent2,
					 featureType: 	"grenzen_g",
					 geometryName: "geom" 				 
				})
		});
		
		
		var afrika = new OpenLayers.Layer.WMS("Afrika", "http://localhost:8080/geoserver/cite/wms",{
				strategies: [new OpenLayers.Strategy.BBOX() ],
				layers: 'cite:afrika_grenzen',
				transparent: true,
				maxExtent: mapextent2,
				projection: WGS84_google_mercator 
		});
		//afrika.setVisibility(false);





 //ANBAU
		var style_anbau = new OpenLayers.Style({
		    pointRadius: "${pRadiusFunction}",
		},
             {
                context: {
                    pRadiusFunction: function (feature) {
                        return Math.sqrt(feature.attributes[pRadius2a]/Math.PI) * 10;
                        console.log(style_anbau.pointRadius);
                           // return (rule_anbau.symbolizer.pointRadius * 2);
                    }
                }
            });
		rule_anbau = new OpenLayers.Rule({
		    symbolizer: {
		        //pointRadius: "${pRadiusFunction}",
		        //label:"${anteil_2010}",
		        fillOpacity: 0.7,
		        fillColor: "#ffc600",
		        strokeColor: "#ffc600"
		    }
		})
		style_anbau.addRules([rule_anbau]);
		var temporaryStyle_anbau = new OpenLayers.Style({
		    fillOpacity: 1,
		    fillColor: "#ffc600",
		    strokeColor: "#ffc600",
		    fontFamily: "Verdana",
		    fontColor: "#ffffff",
		    labelOutlineWidth: 0,
		    labelXOffset: 0,
		    labelYOffset: '${labelOffsetFunction}'
		}, { 
		    context: {
		        labelOffsetFunction: function (feature) {
		            if ((Math.sqrt(feature.attributes[pRadius2a] / Math.PI) * 10) > 15) {
		                return 0;
		            }
		            else
		                return 20;
		        }
		    }
		});

		rule_temp_anbau = new OpenLayers.Rule({
		    symbolizer: {
		        label: pRadius2 + "%"
		    }
		})
		temporaryStyle_anbau.addRules([rule_temp_anbau]);
		var stylem_anbau = new OpenLayers.StyleMap({
		    "default": style_anbau,
		    "temporary": temporaryStyle_anbau
		});

		mais_anbau = new OpenLayers.Layer.Vector("Mais Anbau", {
		    styleMap: stylem_anbau,
		    strategies: [new OpenLayers.Strategy.BBOX(), saveStrategy],
		    projection: WGS84,
		    protocol: new OpenLayers.Protocol.WFS({
		        version: "1.0.0",
		        url: "http://localhost:8080/geoserver/wfs",
		        featureNS: "http://www.opengeospatial.net/cite",
		        maxExtent: mapextent2,
		        featureType: "mais_anbau",
		        geometryName: "centroid"
		    })
		});

		mais_anbau.setVisibility(true);

 //ERTRAG
		var style_ertrag = new OpenLayers.Style();
		rule_ertrag = new OpenLayers.Rule({
		    symbolizer: {
		        pointRadius: "${_2010_}",
		        //label:"${_2010}",
		        fillOpacity: 0.7,
		        fillColor: "#FFA400",
		        strokeColor: "#FFA400"
		    }
		})
		style_ertrag.addRules([rule_ertrag]);
		var temporaryStyle_ertrag = new OpenLayers.Style({
		    fillOpacity: 1,
		    fillColor: "#FFA400",
		    strokeColor: "#FFA400",
		    
		    fontFamily: "Verdana",
		    fontColor: "#ffffff",
		    labelOutlineWidth: 0,
		    labelXOffset: 0,
		    labelYOffset: '${labelOffsetFunction}'
		}, {
		    context: {
		        labelOffsetFunction: function (feature) {
		            if (feature.attributes._2010_ > 15) {
		                return 0;
		            }
		            else
		                return 20;
		        }
		    }
		});
		rule_temp_ertrag = new OpenLayers.Rule({
		    symbolizer: {
		        label: pRadius3
		    }
		})
		temporaryStyle_ertrag.addRules([rule_temp_ertrag]);

		var stylem_ertrag = new OpenLayers.StyleMap({
		    "default": style_ertrag,
		    "temporary": temporaryStyle_ertrag
		});


		mais_ertrag = new OpenLayers.Layer.Vector("Mais Ertrag", {
		    styleMap: stylem_ertrag,
		    strategies: [new OpenLayers.Strategy.BBOX(), saveStrategy],
		    projection: WGS84,
		    protocol: new OpenLayers.Protocol.WFS({
		        version: "1.0.0",
		        url: "http://localhost:8080/geoserver/wfs",
		        featureNS: "http://www.opengeospatial.net/cite",
		        maxExtent: mapextent2,
		        featureType: "mais_ertrag",
		        geometryName: "centroid"
		    })

		});
		mais_ertrag.setVisibility(false);

  //PHOSPHAT

		var style_p = new OpenLayers.Style();
		rule_p = new OpenLayers.Rule({
		    symbolizer: {
		        pointRadius: "${_2010}",
		        //label:"${_2010}",
		        fillOpacity: 0.7,
		        fillColor: "#006c51",
		        strokeColor: "#006c51",
		        externalGraphic: "n_p_symbol.png",
		    }
		})
		style_p.addRules([rule_p]);
		var temporaryStyle_p = new OpenLayers.Style({
		    fillOpacity: 1,
		    fillColor: "#006c51",
		    strokeColor: "#006c51",
		    fontFamily: "Verdana",
		    fontColor: "#D5AE90",
		    labelOutlineWidth: 0,
		    labelXOffset: 0,
		    labelYOffset: '${labelOffsetFunction}'
		}, {
		    context: {
		        labelOffsetFunction: function (feature) {
		            if (feature.attributes._2010 > 15) {
		                return 0;
		            }
		            else
		                return 20;
		        }
		    }
		});
		rule_temp_p = new OpenLayers.Rule({
		    symbolizer: {
		        label: pRadius1
		    }
		})
		temporaryStyle_p.addRules([rule_temp_p]);
		var stylem_p = new OpenLayers.StyleMap({
		    "default": style_p,
		    "temporary": temporaryStyle_p
		});


		phosphat = new OpenLayers.Layer.Vector("Phosphat", {
		    styleMap: stylem_p,
		    strategies: [new OpenLayers.Strategy.BBOX(), saveStrategy],
		    projection: WGS84,
		    protocol: new OpenLayers.Protocol.WFS({
		        version: "1.0.0",
		        url: "http://localhost:8080/geoserver/wfs",
		        featureNS: "http://www.opengeospatial.net/cite",
		        maxExtent: mapextent2,
		        featureType: "phosphate",
		        geometryName: "centroid"
		    })

		});
		phosphat.setVisibility(false);

 //NITROGEN

		var style_n = new OpenLayers.Style();
		rule_n = new OpenLayers.Rule({
		    symbolizer: {
		        pointRadius: "${_2010}",
		        //label:"${_2010}",
		        fillOpacity: 0.7,
		        fillColor: "#5CA82A",
		        strokeColor: "#5CA82A",
		        externalGraphic: "n_symbol.png",
		    }
		})
		style_n.addRules([rule_n]);
		var temporaryStyle_n = new OpenLayers.Style({
		    
		    labelOutlineWidth: 0,
		    labelXOffset: 0,
		    labelYOffset: '${labelOffsetFunction}'
		},{
		    context: {
		        labelOffsetFunction: function (feature) {
		            if (feature.attributes._2010 > 15) {
		                return 0;
		            }
		            else
		                return 20;
		        }
		    }
		});
		rule_temp_n = new OpenLayers.Rule({
		    symbolizer: {
		        label: "${_2010}",
		        fillOpacity: 1,
		        fillColor: "#5CA82A",
		        strokeColor: "#5CA82A",
		        fontFamily: "Verdana",
		        fontColor: "#D5AE90",
		    }
		})
		temporaryStyle_n.addRules([rule_temp_n]);
		var stylem_n = new OpenLayers.StyleMap({
		    "default": style_n,
		    "temporary": temporaryStyle_n
		});


		nitrogen = new OpenLayers.Layer.Vector("Nitrogen", {
		    styleMap: stylem_n,
		    strategies: [new OpenLayers.Strategy.BBOX(), saveStrategy],
		    projection: WGS84,
		    protocol: new OpenLayers.Protocol.WFS({
		        version: "1.0.0",
		        url: "http://localhost:8080/geoserver/wfs",
		        featureNS: "http://www.opengeospatial.net/cite",
		        maxExtent: mapextent2,
		        featureType: "nitrogen",
		        geometryName: "centroid"
		    })

		});

		nitrogen.setVisibility(false);




		
		
 //N+P
		var style_n_P= new OpenLayers.Style();
		rule_n_P = new OpenLayers.Rule({
		    symbolizer: {
		        pointRadius: "${_2010}",
		        //label:"${anteil_2010}",
		        fillOpacity: 0.5,
		        externalGraphic: "p_symbol.png",
		        fillColor: "#866396",
		        strokeColor: "#866396",
		        strokeLineCap: "square",
		        //graphicYOffset: -27.75,
                
		    }
		})
		style_n_P.addRules([rule_n_P]);
		var temporaryStyle_n_P = new OpenLayers.Style({
		    fillOpacity: 1,
		    fillColor: "#866396",
		    strokeColor: "#866396",
		    fontFamily: "Verdana",
		    fontColor: "#D5AE90",
		    labelOutlineWidth: 0,
		    labelXOffset: 0,
		    labelYOffset: '${labelOffsetFunction}'
		}, {
		    context: {
		        labelOffsetFunction: function (feature) {
		            if (feature.attributes._2010 > 15) {
		                return 0;
		            }
		            else
		                return 20;
		        }
		    }
		});
		rule_temp_n_p = new OpenLayers.Rule({
		    symbolizer: {
		        label: pRadius1
		    }
		})
		temporaryStyle_n_P.addRules([rule_temp_n_p]);


		var stylem_n_P = new OpenLayers.StyleMap({
		    "default": style_n_P,
		    "temporary": temporaryStyle_n_P
		});

		n_P = new OpenLayers.Layer.Vector("Nitrogen + Phosphat", {
		    styleMap: stylem_n_P,
		    strategies: [new OpenLayers.Strategy.BBOX(), saveStrategy],
		    projection: WGS84,
		    protocol: new OpenLayers.Protocol.WFS({
		        version: "1.0.0",
		        url: "http://localhost:8080/geoserver/wfs",
		        featureNS: "http://www.opengeospatial.net/cite",
		        maxExtent: mapextent2,
		        featureType: "n_p",
		        geometryName: "centroid"
		    })
		});

		n_P.setVisibility(false);


     //WASSER

		//var symbol = new OpenLayers.Geometry.Polygon.createRegularPolygon(     new OpenLayers.Geometry.Point(0, 0),  1,     30);
		var symbol = new Geometry('circle', 500, 1312978855);

		function Geometry(symbol, maxSize, maxValue) {
		    this.symbol = symbol;
		    this.maxSize = maxSize;
		    this.maxValue = maxValue;

		    this.getSize = function (value) {
		        switch (this.symbol) {
		            case 'circle': // Returns radius of the circle
		            case 'square': // Returns length of a side
		                return Math.sqrt(value / this.maxValue) * this.maxSize;
		            case 'bar': // Returns height of the bar
		                return (value / this.maxValue) * this.maxSize;
		            case 'sphere': // Returns radius of the sphere
		            case 'cube': // Returns length of a side
		                return Math.pow(value / this.maxValue, 1 / 3) * this.maxSize;
		        }
		    }
		}
		var context = {
		    getSize: function (feature) {
		        return 20 + Math.round(symbol.getSize(feature.attributes["gesamt"]) * Math.pow(2, map.getZoom() - 1));
		    },
		    getChartURL: function (feature) {
		        var values = feature.attributes["gesamt"] + ',' + (100-feature.attributes["gesamt"]) ;
		       // var size = 20 + Math.round(symbol.getSize(feature.attributes["gesamt"]) * Math.pow(2, map.getZoom() - 1));
		        var charturl = 'http://chart.apis.google.com/chart?chco=0570EF|302B2B&cht=p&chd=t:' + values + '&chs=' + 500 + 'x' + 500 + '&chf=bg,s,ffffff00&chp=-1.570775';
		        return charturl;
		    }
		};

		var template = {
		    fillOpacity: 0.7,
		    externalGraphic: "${getChartURL}",
		    graphicWidth: 40,
		    graphicHeight: 40,
		    strokeWidth: 0
		};

		
		var style_wasser = new OpenLayers.Style(template, { context: context });
		rule_wasser = new OpenLayers.Rule({
		    symbolizer: {
		        pointRadius: "${gesamt}",
		        //label:"${anteil_2010}",
		        fillOpacity: 0.7,
		        fillColor: "#216477",
		        strokeColor: "#216477"
		    }
		})
		style_wasser.addRules([rule_wasser]);

		var temporaryStyle_wasser = new OpenLayers.Style({
		    fillOpacity: 1,
		    fillColor: "#216477",
		    strokeColor: "#216477",
		    label: "${gesamt}"+"%",
		    fontFamily: "Verdana",
		    fontColor: "#ffffff",
		    labelOutlineWidth: 0,
		    labelXOffset: 0,
		   labelYOffset: 25
		}, {
		    context: {
		        labelOffsetFunction: function (feature) {
		            if (feature.attributes._2010 > 15) {
		                return 0;
		            }
		            else
		                return 20;
		        }
		    }
		});

		var stylem_wasser = new OpenLayers.StyleMap({
		    "default": style_wasser,
		    "temporary": temporaryStyle_wasser
		});

		wasser = new OpenLayers.Layer.Vector("Wasserverbrauch", {
		    styleMap: stylem_wasser,
		    strategies: [new OpenLayers.Strategy.BBOX(), saveStrategy],
		    projection: WGS84,
		    protocol: new OpenLayers.Protocol.WFS({
		        version: "1.0.0",
		        url: "http://localhost:8080/geoserver/wfs",
		        featureNS: "http://www.opengeospatial.net/cite",
		        maxExtent: mapextent2,
		        featureType: "wasser",
		        geometryName: "centroid"
		    })
		});

		wasser.setVisibility(false);


		map.addLayers([afrika, grenzen, phosphat, mais_ertrag, mais_anbau, nitrogen, wasser, n_P ]);
		
		//map.setLayerIndex(afrika, 0);

		
		map.zoomToExtent(mapextent3);
		
		//TOOLBAR 
 		
			 var panel = new OpenLayers.Control.Panel(
			 {'displayClass': 'customEditingToolbar'}
			 );
	
			 var navigate = new OpenLayers.Control.Navigation({
			 title: "Pan Map"
			 });
			  
		 var highlightCtrl = new OpenLayers.Control.SelectFeature([grenzen, mais_anbau, mais_ertrag, phosphat, nitrogen, wasser, n_P], {
			     hover: true,
			     highlightOnly: true,
			     renderIntent: "temporary"
			 }); 
			 
			 var selectCtrl = new OpenLayers.Control.SelectFeature(grenzen,{
			     clickout: true,
				  }
             );
			 
			 
 panel.addControls([navigate , selectCtrl, highlightCtrl  ]);
 panel.defaultControl = navigate;
 map.addControl(panel);
 highlightCtrl.activate();
 selectCtrl.activate();

		
 grenzen.events.on({
     "featureselected":  getSmallMap,
     "featureunselected": onFeatureUnselect
 });

   } // ENDE INIT





  

function graphexample() {

var request1 = OpenLayers.Request.GET({
			url: "http://localhost:8080/geoserver/cite/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=cite:mais_anbau&outputFormat=json",
			callback: handler
		});
var jsonobj;
var obj;
function handler(request) {
			obj = JSON.parse(request1.responseText);
			jsonobj = request1.responseText;
		}
setTimeout(anbausumData, 5000);

var jsonAnbauData;
var anbauObj;
var sum2010 = 0.0;
var sum2009 = 0.0;
var sum2008 = 0.0;
var sum2007 = 0.0;
var sum2006 = 0.0;
var sum2005 = 0.0;
var sum2004 = 0.0;
var sum2003 = 0.0;
var sum2002 = 0.0;
var sum2001 = 0.0;
var sum2000 = 0.0;
var sumAnbauWerte = [];
var year = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010];
function anbausumData() {
	var len = obj.features.length,
		len2 = year.length,
		anbauData = {key: "Anbauflaeche", values:[]},
		i;
		for ( i=0; i < len; i+=1 ) {
			//console.log(obj.features[i].properties._2010);
			sum2010 = sum2010 + obj.features[i].properties._2010;
			sum2009 = sum2009 + obj.features[i].properties._2009;
			sum2008 = sum2008 + obj.features[i].properties._2008;
			sum2007 = sum2007 + obj.features[i].properties._2007;
			sum2006 = sum2006 + obj.features[i].properties._2006;
			sum2005 = sum2005 + obj.features[i].properties._2005;
			sum2004 = sum2004 + obj.features[i].properties._2004;
			sum2003 = sum2003 + obj.features[i].properties._2003;
			sum2002 = sum2002 + obj.features[i].properties._2002;
			sum2001 = sum2001 + obj.features[i].properties._2001;
			sum2000 = sum2000 + obj.features[i].properties._2000;
		}
		
		sumAnbauWerte = [sum2000, sum2001, sum2002, sum2003, sum2004, sum2005, sum2006, sum2007, sum2008, sum2009, sum2010];
		for (i=0; i < len2; i++){
		anbauData.values.push({"year": year[i], "value": sumAnbauWerte[i]});
		}
		jsonAnbauData = JSON.stringify(anbauData, undefined, 2);
		//jsonAnbauData = "[" + jsonAnbauData + "]";
		//anbauObj = JSON.parse(jsonAnbauData);		
	showgraph3();
}

var request2 = OpenLayers.Request.GET({
    url: "http://localhost:8080/geoserver/cite/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=cite:mais_ertrag&outputFormat=json",
    callback: handler2
});
var jsonobj2;
var obj2;
function handler2(request) {
    obj2 = JSON.parse(request2.responseText);
    jsonobj2 = request2.responseText;
    ertragsumData();
}
//setTimeout(ertragsumData, 5000);
var anbau_ertrag_Obj;
var jsonData;
var jsonErtragData;
var ertragObj;
var sum2010_e = 0.0;
var sum2009_e = 0.0;
var sum2008_e = 0.0;
var sum2007_e = 0.0;
var sum2006_e = 0.0;
var sum2005_e = 0.0;
var sum2004_e = 0.0;
var sum2003_e = 0.0;
var sum2002_e = 0.0;
var sum2001_e = 0.0;
var sum2000_e = 0.0;
var sumErtragWerte = [];
function ertragsumData() {
    var len = obj2.features.length,
		len2 = year.length,
		ertragData = { key: "Ertrag", values: [] },
		i;
    for (i = 0; i < len; i += 1) {
        //console.log(obj.features[i].properties._2010);
        sum2010_e = sum2010_e + obj2.features[i].properties._2010;
        sum2009_e = sum2009_e + obj2.features[i].properties._2009;
        sum2008_e = sum2008_e + obj2.features[i].properties._2008;
        sum2007_e = sum2007_e + obj2.features[i].properties._2007;
        sum2006_e = sum2006_e + obj2.features[i].properties._2006;
        sum2005_e = sum2005_e + obj2.features[i].properties._2005;
        sum2004_e = sum2004_e + obj2.features[i].properties._2004;
        sum2003_e = sum2003_e + obj2.features[i].properties._2003;
        sum2002_e = sum2002_e + obj2.features[i].properties._2002;
        sum2001_e = sum2001_e + obj2.features[i].properties._2001;
        sum2000_e = sum2000_e + obj2.features[i].properties._2000;
    }

    sumErtragWerte = [sum2000_e, sum2001_e, sum2002_e, sum2003_e, sum2004_e, sum2005_e, sum2006_e, sum2007_e, sum2008_e, sum2009_e, sum2010_e];
    for (i = 0; i < len2; i++) {
        ertragData.values.push({ "year": year[i], "value": sumErtragWerte[i] });
    }
    jsonErtragData = JSON.stringify(ertragData, undefined, 2);
    jsonData = "[" + jsonErtragData + "]";
    //ertragObj = JSON.parse(jsonErtragData);
    anbau_ertrag_Obj = JSON.parse(jsonData);
    showgraph3();

}




function showgraph3() {

        nv.addGraph(function () {
            var chart = nv.models.lineChart()
                          .x(function (d) { return d.year })
                          .y(function (d) { return d.value}) 
                          //.color(d3.scale.category10().range(colorbrewer.YlOrBr[6]))
                            .color([ '#ffa200'])
                          .useInteractiveGuideline(true)
                          .width(550)             
            ;
            chart.yAxis
                .tickFormat(d3.format('.2f'));
            chart.showYAxis(false);
           // chart.showControls(false);
            chart.margin({ left: 15 });
            d3.select('#chart svg')
                .datum(anbau_ertrag_Obj)
                .call(chart);
            d3.select('#chart svg')
            .style("fill", "#D5AE90");
            //.attr("fill", "none");
            nv.utils.windowResize(chart.update);
            return chart;
        });

}

}

function preisgraph() {


    var request3 = OpenLayers.Request.GET({
        url: "http://localhost:8080/geoserver/cite/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=cite:maispreis&outputFormat=json",
        callback: handler3
    });
    var jsonobj3;
    var obj3;

    
    var jsonData;
    var jsonPreisData;
    var preis_Obj;

    var preise = [];
    var jahre = [];
    var monate = [];
    var year = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010];
    function handler3(request) {
        obj3 = JSON.parse(request3.responseText);
        jsonobj3 = request3.responseText;
        console.log(obj3);
        for ( i = 0; i < obj3.features.length; i++) {
            var jahr = obj3.features[i].properties.Jahr;
            var preis = obj3.features[i].properties.Preis;
            var monat = obj3.features[i].properties.Monat;
            preise.push(preis);
            var date = jahr+"."+monat
            jahre.push(jahr);
            monate.push(monat);

        }
        console.log(preise);
        console.log(jahre);


        var preisData = { key: "Maispreisindex", values: [] };
        for (j = 0; j < preise.length; j++) {
            var date1 = new Date (jahre[j], monate[j]);
            preisData.values.push({ "year": jahre[j], "monat": monate[j], "value": preise[j], "date":date1 });
        }
        jsonPreisData = JSON.stringify(preisData, undefined, 2);
        jsonData = "[" + jsonPreisData + "]";
        //ertragObj = JSON.parse(jsonErtragData);
        preis_Obj = JSON.parse(jsonData);
        showPreisGraph();
    }

    function showPreisGraph() {
        nv.addGraph(function () {
            var chart = nv.models.discreteBarChart()
                          .x(function (d) { return d.date })
                          .y(function (d) { return d.value })
                            .color(['#e9003a'])
                          //.useInteractiveGuideline(true)
                          .width(550)
            .tooltips(false)
            ;
            chart.yAxis
                .tickFormat(d3.format('.2f'));
            chart.showYAxis(false);
            chart.xAxis.tickFormat(function (d) {
                return d3.time.format("%m/%y")(new Date(d))
            });
            chart.showXAxis(false);
            // chart.showControls(false);
            chart.margin({ left: 15 });
            d3.select('#chart6 svg')
                .datum(preis_Obj)
                .call(chart);
            d3.select('#chart6 svg')
            .style("fill", "#D5AE90")
  

            nv.utils.windowResize(chart.update);
            return chart;
        });
    }
   

}

function setButtonInactive(clickedid) {
    var btn_2000 = document.getElementById("_2000");
    var btn_2001 = document.getElementById("_2001");
    var btn_2002 = document.getElementById("_2002");
    var btn_2003 = document.getElementById("_2003");
    var btn_2008 = document.getElementById("_2008");
    var jahrBtns = document.getElementsByName("jahr");

    if (clickedid == "btnP") {
        for (i = 0; i < jahrBtns.length; i++) {
            jahrBtns[i].style = "";
        }
        btn_2000.style.backgroundColor = "#151515";
        btn_2000.style.cursor = "auto";
        btn_2000.style.border = 'none';
        btn_2000.style.color = '#302b2b';
        btn_2001.style.backgroundColor = "#151515";
        btn_2001.style.cursor = "auto";
        btn_2001.style.border = 'none';
        btn_2001.style.color = '#302b2b';
    }
    else if (clickedid == "btnN") {
        for (i = 0; i < jahrBtns.length; i++) {
            jahrBtns[i].style = "";
        }
        btn_2000.style.backgroundColor = "#151515";
        btn_2000.style.cursor = "auto";
        btn_2000.style.border = 'none';
        btn_2000.style.color = '#302b2b';
        btn_2001.style.backgroundColor = "#151515";
        btn_2001.style.cursor = "auto";
        btn_2001.style.border = 'none';
        btn_2001.style.color = '#302b2b';
    }
    else if (clickedid == "btnPN") {
        for (i = 0; i < jahrBtns.length; i++) {
            jahrBtns[i].style = "";
        }
        btn_2000.style.backgroundColor = "#151515";
        btn_2000.style.cursor = "auto";
        btn_2000.style.border = 'none';
        btn_2000.style.color = '#302b2b';
        btn_2001.style.backgroundColor = "#151515";
        btn_2001.style.cursor = "auto";
        btn_2001.style.border = 'none';
        btn_2001.style.color = '#302b2b';
    }
    else if (clickedid == "btnWasser") {
        for (i = 0; i < jahrBtns.length; i++) {
            jahrBtns[i].style = "";
        }
        for (i = 0; i < jahrBtns.length; i++) {
            jahrBtns[i].style.backgroundColor = "#151515";
            jahrBtns[i].style.cursor = "auto";
            jahrBtns[i].style.border = 'none';
            jahrBtns[i].style.color = '#302b2b';
        }
        btn_2000.style.color = '';
        btn_2001.style.color = '';
        btn_2002.style.color = '';
        btn_2003.style.color = '';

    }
    else {
        for (i = 0; i < jahrBtns.length; i++) {
            jahrBtns[i].style = "";
        }
    }
    
    

    

}


function getSmallMap(event) {
    if (smallMap != null) {
        smallMap.destroy();
    }
    else {
    }

    var WGS84_google_mercator = new OpenLayers.Projection("EPSG:3857");
    var WGS84 = new OpenLayers.Projection("EPSG:4326");
    var mapextent2 = new OpenLayers.Bounds(23, -20, 50, 13).transform(WGS84, WGS84_google_mercator);
    var neuextent;
    var featureSelected = event.feature;
    var landName = featureSelected.attributes.name_0;
    var ueberschrift = document.getElementById("landtext");
    ueberschrift.innerHTML = "&nbsp &nbsp &nbsp" + landName;

  smallMap = new OpenLayers.Map("smallMap", {
        controls: [
        // allows the user pan ability
       // new OpenLayers.Control.Navigation(),
       // displays the pan/zoom tools                    
       new OpenLayers.Control.PanZoom(),
        //displays a layer switcher
        new OpenLayers.Control.LayerSwitcher()
        ],
        projection: WGS84_google_mercator,
        allOverlays: true
        //maxextent: mapextent
  });

  var mapnik = new OpenLayers.Layer.OSM();
  mapnik.setVisibility(false);
    //GRENZEN
  var style_grenzen = new OpenLayers.Style();

  var rule_grenzen = new OpenLayers.Rule({
      filter: new OpenLayers.Filter.Comparison({
          type: OpenLayers.Filter.Comparison.EQUAL_TO,
          property: "name_0",
          value: landName,
      }),
      symbolizer: {
          fillOpacity: 0,
          fillColor: "#302B2B",
          strokeColor: "#865D47",
          strokeWidth: 2,
      }      
  });

  style_grenzen.addRules([rule_grenzen]);
  var stylem_grenzen = new OpenLayers.StyleMap({
      "default": style_grenzen,
  });

  grenzen = new OpenLayers.Layer.Vector("Grenzen", {
      styleMap: stylem_grenzen,
      strategies: [new OpenLayers.Strategy.BBOX(), saveStrategy],
      projection: WGS84,
      protocol: new OpenLayers.Protocol.WFS({
          version: "1.0.0",
          url: "http://localhost:8080/geoserver/wfs",
          featureNS: "http://www.opengeospatial.net/cite",
          maxExtent: mapextent2,
          featureType: "grenzen_g",
          geometryName: "geom"
      })
  });

  smallMap.addLayers([mapnik, grenzen]);
  smallMap.zoomToExtent(mapextent2);

 setTimeout(getExtent, 500);
 function getExtent() {
    neuextent = event.feature.geometry.getBounds();
     smallMap.zoomToExtent(neuextent);
 }
setTimeout( diagramme, 500);

function diagramme() {
    var data_Obj;
    var data_Obj2;
    var data_Obj3;
    var data_Obj4;
    var year = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010];

    // NITROGEN 
     var nitrogenProLand;
     var nitrogenProJahr = [];
     var nitrogenData;
     var jsonNitrogenData;

     var request_n = OpenLayers.Request.GET({
          url: "http://localhost:8080/geoserver/cite/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=cite:nitrogen&outputFormat=json",
         callback: handler_n
     });
    
     function handler_n(request_n) {
         var json_n = request_n.responseText; 
         var obj_n = JSON.parse(json_n);
         var allfeats = obj_n.features;

         for (var i = 0; i < allfeats.length; i++) {
             
             if (allfeats[i].properties.land == landName )
             {
                 nitrogenProLand = allfeats[i];
             }
         }
         console.log(nitrogenProLand);
         var nProLandprop = nitrogenProLand.properties;
         console.log(nProLandprop);
         var n_2000 = nProLandprop._2000;
         var n_2001 = nProLandprop._2001;
         var n_2002 = nProLandprop._2002;
         var n_2003 = nProLandprop._2003;
         var n_2004 = nProLandprop._2004;
         var n_2005 = nProLandprop._2005;
         var n_2006 = nProLandprop._2006;
         var n_2007 = nProLandprop._2007;
         var n_2008 = nProLandprop._2008;
         var n_2009 = nProLandprop._2009;
         var n_2010 = nProLandprop._2010;
         nitrogenProJahr = [n_2000, n_2001, n_2002, n_2003, n_2004, n_2005, n_2006, n_2007, n_2008, n_2009, n_2010];
         Dataf();
     }

    // PHOSPHAT 
     var phosphatProLand;
     var phosphatProJahr = [];
     var phosphatData;
     var jsonphosphatData;

     var request_p = OpenLayers.Request.GET({
         url: "http://localhost:8080/geoserver/cite/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=cite:phosphate&outputFormat=json",
         callback: handler_p
     });

     function handler_p(request_p) {
         var json_p = request_p.responseText;
         var obj_p = JSON.parse(json_p);
         var allfeats = obj_p.features;

         for (var i = 0; i < allfeats.length; i++) {

             if (allfeats[i].properties.land == landName) {
                 phosphatProLand = allfeats[i];
             }
         }
         console.log(phosphatProLand);
         var nProLandprop = phosphatProLand.properties;
         var n_2000 = nProLandprop._2000;
         var n_2001 = nProLandprop._2001;
         var n_2002 = nProLandprop._2002;
         var n_2003 = nProLandprop._2003;
         var n_2004 = nProLandprop._2004;
         var n_2005 = nProLandprop._2005;
         var n_2006 = nProLandprop._2006;
         var n_2007 = nProLandprop._2007;
         var n_2008 = nProLandprop._2008;
         var n_2009 = nProLandprop._2009;
         var n_2010 = nProLandprop._2010;
         phosphatProJahr = [n_2000, n_2001, n_2002, n_2003, n_2004, n_2005, n_2006, n_2007, n_2008, n_2009, n_2010];
         Dataf();
     }

    // ANBAU
     var anbauProLand;
     var anbauProJahr = [];
     var anbauData;
     var jsonanbauData;

     var request_anbau = OpenLayers.Request.GET({
         url: "http://localhost:8080/geoserver/cite/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=cite:mais_anbau&outputFormat=json",
         callback: handler_anbau
     });

     function handler_anbau(request_anbau) {
         var json_anbau = request_anbau.responseText;
         var obj_anbau = JSON.parse(json_anbau);
         var allfeats = obj_anbau.features;

         for (var i = 0; i < allfeats.length; i++) {

             if (allfeats[i].properties.land == landName) {
                 anbauProLand = allfeats[i];
             }
         }
         console.log(anbauProLand);
         var nProLandprop = anbauProLand.properties;
         var n_2000 = nProLandprop._2000;
         var n_2001 = nProLandprop._2001;
         var n_2002 = nProLandprop._2002;
         var n_2003 = nProLandprop._2003;
         var n_2004 = nProLandprop._2004;
         var n_2005 = nProLandprop._2005;
         var n_2006 = nProLandprop._2006;
         var n_2007 = nProLandprop._2007;
         var n_2008 = nProLandprop._2008;
         var n_2009 = nProLandprop._2009;
         var n_2010 = nProLandprop._2010;
         anbauProJahr = [n_2000, n_2001, n_2002, n_2003, n_2004, n_2005, n_2006, n_2007, n_2008, n_2009, n_2010];
         Dataf();
     }

    // ERTRAG
     var ertragProLand;
     var ertragProJahr = [];
     var ertragData;
     var jsonertragData;

     var request_ertrag = OpenLayers.Request.GET({
         url: "http://localhost:8080/geoserver/cite/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=cite:mais_ertrag&outputFormat=json",
         callback: handler_ertrag
     });

     function handler_ertrag(request_ertrag) {
         var json_ertrag = request_ertrag.responseText;
         var obj_ertrag = JSON.parse(json_ertrag);
         var allfeats = obj_ertrag.features;

         for (var i = 0; i < allfeats.length; i++) {

             if (allfeats[i].properties.land == landName) {
                 ertragProLand = allfeats[i];
             }
         }
         console.log(ertragProLand);
         var nProLandprop = ertragProLand.properties;
         var n_2000 = nProLandprop._2000;
         var n_2001 = nProLandprop._2001;
         var n_2002 = nProLandprop._2002;
         var n_2003 = nProLandprop._2003;
         var n_2004 = nProLandprop._2004;
         var n_2005 = nProLandprop._2005;
         var n_2006 = nProLandprop._2006;
         var n_2007 = nProLandprop._2007;
         var n_2008 = nProLandprop._2008;
         var n_2009 = nProLandprop._2009;
         var n_2010 = nProLandprop._2010;
         ertragProJahr = [n_2000, n_2001, n_2002, n_2003, n_2004, n_2005, n_2006, n_2007, n_2008, n_2009, n_2010];
         Dataf();
     }

    // WASSER
     var wasserProLand;
     var wasserProJahr = [];
     var wasserData;
     var jsonwasserData;
     var wasservalues;
     var wasservalue;
     var request_wasser = OpenLayers.Request.GET({
         url: "http://localhost:8080/geoserver/cite/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=cite:wasser&outputFormat=json",
         callback: handler_wasser
     });

     function handler_wasser(request_wasser) {
         var json_wasser = request_wasser.responseText;
         var obj_wasser = JSON.parse(json_wasser);
         var allfeats = obj_wasser.features;

         for (var i = 0; i < allfeats.length; i++) {

             if (allfeats[i].properties.land == landName) {
                 wasserProLand = allfeats[i];
                 console.log(wasserProLand);
                 wasservalues = wasserProLand.properties["gesamt"] + ',' + (100 - wasserProLand.properties["gesamt"]);
                 console.log("wasservalues: ", wasservalues);
                 wasservalue = wasserProLand.properties["gesamt"];
             }
             
         }
 
         //var size = 20 + Math.round(symbol.getSize(feature.attributes["gesamt"]) * Math.pow(2, map.getZoom() - 1));
         var charturl = 'http://chart.apis.google.com/chart?chco=0570EF|302B2B&cht=p&chd=t:' + wasservalues + '&chs=' + 150 + 'x' + 150 + '&chf=bg,s,ffffff00&chp=-1.570775';
         var wasserdiv = document.getElementById("chart5");
         wasserdiv.innerHTML = '<' + 'object id="foo" name="foo" type="text/html" data="' + charturl + '"><\/object>';
         var wassertext = document.getElementById("wassertext");
         wassertext.innerHTML = "Wasserverbrauch der Landwirtschaft: " + wasservalue + "%";
     }

     

     function Dataf() {
         //NITROGEN
         nitrogenData = { key: "Nitrogen", values: [] };
         for (j = 0; j < year.length; j++) {
             nitrogenData.values.push({ "year": year[j], "value": nitrogenProJahr[j] });
         }
         jsonNitrogenData = JSON.stringify(nitrogenData, undefined, 2);
         //PHOSPHAT
         phosphatData = { key: "Phosphat", values: [] };
         for (j = 0; j < year.length; j++) {
             phosphatData.values.push({ "year": year[j], "value": phosphatProJahr[j] });
         }
         jsonphosphatData = JSON.stringify(phosphatData, undefined, 2);
         //ANBAU
         anbauData = { key: "Anbau", values: [] };
         for (j = 0; j < year.length; j++) {
             anbauData.values.push({ "year": year[j], "value": anbauProJahr[j] });
         }
         jsonanbauData = JSON.stringify(anbauData, undefined, 2);
         //ERTRAG
         ertragData = { key: "Ertrag", values: [] };
         for (j = 0; j < year.length; j++) {
             ertragData.values.push({ "year": year[j], "value": ertragProJahr[j] });
         }
         jsonertragData = JSON.stringify(ertragData, undefined, 2);
         //ALLE ZUSAMMEN
         jsonData = "[" + jsonNitrogenData + "," + jsonphosphatData + "]";
         //jsonData2 = "[" + jsonanbauData + "," + jsonertragData + "]";
         jsonData3 = "[" + jsonanbauData  + "]";
         jsonData4 = "[" + jsonertragData + "]";
         //console.log(jsonData2);
         data_Obj = JSON.parse(jsonData);
         //data_Obj2 = JSON.parse(jsonData2);
         data_Obj3 = JSON.parse(jsonData3);
         data_Obj4 = JSON.parse(jsonData4);
         showgraph3();
         showgraph4();
         showgraph5();
     }
     
     function showgraph3() {

         nv.addGraph(function () {
             var yScale = d3.scale.linear();
             yScale.domain([0, 64]);
             var chart = nv.models.multiBarChart()
                           .x(function (d) { return d.year })
                           .y(function (d) { return d.value })
                             .color(['#5CA82A', '#006c51'])
                           .width(600)
                           .stacked(true)
                           .staggerLabels(false)
             
             ;
             chart.yAxis
                 .tickFormat(d3.format('.2f'))
                 .scale(yScale);
             chart.forceY([0, 64])
             //chart.showControls(false);
             //chart.margin({ left: 100 });
             d3.select('#chart2 svg')
                 .datum(data_Obj)
                 .call(chart);
             d3.select('#chart2 svg')
             .style("fill", "#D5AE90");
             nv.utils.windowResize(chart.update);
             return chart;
         });

     }

     function showgraph4() {

         nv.addGraph(function () {
             var yScale = d3.scale.linear();
             yScale.domain([0, 64]);
             var chart = nv.models.multiBarChart()
                           .x(function (d) { return d.year })
                           .y(function (d) { return d.value })
                             .color(['#ffc600'])
                           .width(600)
                          .stacked(true)
                          .staggerLabels(false)
                           .tooltips(true)
             ;
             chart.yAxis
                 .tickFormat(d3.format('.2f'))
                 //.scale(yScale)
             ;
             //chart.forceY([0, 64])
             chart.showControls(false);


             var makeLegend = nv.models.legend()
                       //initialize legend function

                   .key(function (d) { return d.key; });
             chart.margin({ left: 100 });
             d3.select('#chart3 svg')
                 .datum(data_Obj3)
                 .call(chart);
             d3.select('#chart3 svg')
             .style("fill", "#D5AE90");
             nv.utils.windowResize(chart.update);
             return chart;
         });
     }

     function showgraph5() {

         nv.addGraph(function () {
             var yScale = d3.scale.linear();
             yScale.domain([0, 64]);
             var chart = nv.models.multiBarChart()
                           .x(function (d) { return d.year })
                           .y(function (d) { return d.value })
                             .color([ '#ffa200'])
                           .width(600)
                           .stacked(true)
                           .staggerLabels(false)
                           .tooltips(true)
             ;
             chart.yAxis
                 .tickFormat(d3.format('.2f'))
             //.scale(yScale)
             ;
             //chart.forceY([0, 64])
             chart.showControls(false);
             chart.margin({ left: 100 });
             d3.select('#chart4 svg')
                 .datum(data_Obj4)
                 .call(chart);
             d3.select('#chart4 svg')
             .style("fill", "#D5AE90");
             nv.utils.windowResize(chart.update);
             return chart;
         });
     }
}
}

function onFeatureUnselect() {

}



function toggle_visibility() {
    var e = document.getElementById("werte_legende");
    var randnotiz = document.getElementById("randNotiz");
    if (e.style.display == 'block') {
        e.style.display = 'none';
        randnotiz.style.display = 'block';
    }
    else {
        e.style.display = 'block';
        randnotiz.style.display = 'none';
    }
}