var MapaGuerraResultado = SuperWidget.extend({
	zoomClientes: null,
	dsRepresentante: 'representante',
    dsCampanhas: 'acoesMapaVenda',
    clientesMap: [],
    representanteLatitude: 0,
    representanteLongitude: 0,
    representanteRaio: 0,
	
	bindings: {
		local: {
			'edit-save': ['click_saveSettings'],
			'view-changeCampanha' : ['change_selectCampanha']
		}
	},
	
	init : function() {
		this.fdwt = Object.create(Fdwt);
		this.fdwt.instanceId = this.instanceId;
		this.fdwt.loadDatasetFactory();
		this.fdwt.loadMustache();
		this.fdwt.init(this);

		if (this.isEditMode) {
			this.eMode();
		} else {
			this.vMode();
			this.fdwt.hideLoading();
		}
	},
	
	/******/
	/*EDIT*/
	/******/
	saveSettings: function() {
		var args = this.fdwt.getTemaData();
		args.zoomClientes = $('#zoomClientes',this.sGetContext()).val();
		var _result = WCMSpaceAPI.PageService.UPDATEPREFERENCES({ async: false }, this.instanceId, args);

		if (_result) {
			FLUIGC.toast({
				title: '',
				message: 'As configurações foram gravadas com sucesso.',
				type: 'success'
			});
		} else {
			FLUIGC.toast({
				title: '',
				message: 'Erro, as configurações não foram gravadas.',
				type: 'danger'
			});
		}
	},

	eMode: function() {
		
	},

	/******/
	/*VIEW*/
	/******/
	vMode: function() {
		this.loadCampanhas();
	},
	
    initGraph: function(campanha) {
    	var that = this;
        var arrRetornoCampanha = [];
        var arrCnaes = [];
        var arrTamanho = [];
        var representante = "";
        var codRep = "";
        var c1 = DatasetFactory.createConstraint('codCampanha', campanha, campanha, ConstraintType.MUST);
        var c2 = DatasetFactory.createConstraint('metadata#active', true, true, ConstraintType.MUST);
        var dataset = DatasetFactory.getDataset(this.dsCampanhas, null, [c1, c2], null);
        var countBase = 0;
        var countNovo = 0;
        var countTotalRegistros = 0;
        var countAcoesComSucesso = 0;
        var countAcoesNaoRealizadas = 0;
        var countAcoesComSucessoClientesBase = 0;
        var countAcoesComSucessoNovosClientes = 0;
        var valorTotalVendas = 0.0;
		var icone = '';
		var html = '';

        if (dataset != undefined && dataset.values.length > 0) {
            for (var i = 0; i < dataset.values.length; i++) {
            	icone = '';
            	html = '';
            	countTotalRegistros++;
            	representante = dataset.values[i].nmRep;
            	codRep = dataset.values[i].codRep;
            	if(dataset.values[i].cnaeDescricao != '') {
	            	arrCnaes.push(dataset.values[i].cnaeDescricao);
            	}
            	if(dataset.values[i].tamanhoFunc != '') {
            		arrTamanho.push(that.retornaDescricaoTamanho(dataset.values[i].tamanhoFunc));
            	}
            	if(dataset.values[i].vlVendido != '') {
            		valorTotalVendas += that.stringToNumber(dataset.values[i].vlVendido, 2);
            	}
            	arrRetornoCampanha.push({
            		codCampanha: dataset.values[i].codCampanha,
                    resultadoAcao: dataset.values[i].resultadoAcao,
                    tpCliente: dataset.values[i].tpCliente
                });
            	if(dataset.values[i].resultadoAcao == '2') { //Ação Realizada Com Sucesso
            		countAcoesComSucesso++;
            	}
            	if(dataset.values[i].resultadoAcao == '1') { //Ação Não Realizada
            		countAcoesNaoRealizadas++;
            	}
            	if(dataset.values[i].tpCliente.toUpperCase() == 'BASE') {
            		countBase++;
            		icone = that.getIconColor("2");
                    html += '<div style="width: 300px;"><h4 style="margin-bottom: 8px;">'+dataset.values[i].razaoSocial+'</h4>';
                    html +=  '<br/>'+dataset.values[i].cnpj;
                    html +=  '<br/>'+dataset.values[i].logradouro + ' ' + dataset.values[i].numero;  
                    html +=  '<br/>'+dataset.values[i].bairro;
                    html +=  '<br/>'+dataset.values[i].CEP;
                    html +=  '<br/>'+dataset.values[i].cidade+' - '+dataset.values[i].estado;
                    html +=  '<br/><a href="tel://' + dataset.values[i].telefone + '">Ligar Telefone</a>';
                    html +=  '<br/><a href="tel://' + dataset.values[i].celular + '">Ligar Celular</a>';
                    html += '</div>';
            		if(dataset.values[i].resultadoAcao == '2') { //Ação Realizada Com Sucesso
            			countAcoesComSucessoClientesBase++;
            		}
            	} else {
            		countNovo++;
                    html += '<div style="width: 300px;"><h4 style="margin-bottom: 8px;">'+dataset.values[i].razaoSocial+'</h4>';
                    html +=  '<br/>'+dataset.values[i].cnpj;
                    html +=  '<br/>'+dataset.values[i].logradouro + ' ' + dataset.values[i].numero;  
                    html +=  '<br/>'+dataset.values[i].bairro;
                    html +=  '<br/>'+dataset.values[i].CEP;
                    html +=  '<br/>'+dataset.values[i].cidade;
                    html += '</div>';            		
                    if(dataset.values[i].resultadoAcao == '2') { //Ação Realizada Com Sucesso
            			countAcoesComSucessoNovosClientes++;
                		icone = that.getIconColor("3");
            		} else {
            			icone = that.getIconColor("");
            		}
            	}
            	if(dataset.values[i].latitude != '' && dataset.values[i].longitude != '' ) {
					that.clientesMap.push({
						latitude: dataset.values[i].latitude,
						longitude: dataset.values[i].longitude,
						html: html,
						icon: icone
					})
            	};
            }
        }

		var c11 = DatasetFactory.createConstraint('metadata#active', true, true, ConstraintType.MUST);
		var c21 = DatasetFactory.createConstraint('codRep', codRep, codRep, ConstraintType.MUST);
		var dataset11 = DatasetFactory.getDataset(that.dsRepresentante, null, [c11, c21], null);
    	that.representanteLatitude = 0;
    	that.representanteLongitude = 0;
    	that.representanteRaio = 0;

		if (dataset11 != undefined && dataset11.values.length > 0) {
			that.clientesMap.push({
				latitude: dataset11.values[0].latitude,
				longitude: dataset11.values[0].longitude,
				html: '<div style="width: 300px;"><h4 style="margin-bottom: 8px;">'+ representante +'</h4></div>',
				icon: that.getIconColor("1")
			})
		    that.representanteLatitude = dataset11.values[0].latitude;
    		that.representanteLongitude = dataset11.values[0].longitude;
    		that.representanteRaio = dataset11.values[0].raio;
		}
		
		if (representante != undefined && representante != '') {
			$('#txtRepresentante',this.sGetContext()).text(representante);
		}
		
        if (arrCnaes != undefined && arrCnaes.length > 0) {
        	$('#txtAreaAtuacao',this.sGetContext()).text($.unique(arrCnaes).join());
        }
		
        if (arrTamanho != undefined && arrTamanho.length > 0) {
        	$('#txtTamanhoFunc',this.sGetContext()).text($.unique(arrTamanho).join());
        }

        if (valorTotalVendas != undefined && valorTotalVendas > 0) {
        	$('#txtValorTotal',this.sGetContext()).text('Total em Vendas - R$ ' + that.formatMoney(valorTotalVendas, 2, ",","."));
        }
        
        var dataAcoesComSucesso = [
            {
                value: countAcoesComSucessoClientesBase,
                color:"#800080",
                highlight: "#EE82EE",
                label: "Ações Com Sucesso"
            },
            {
                value: countBase - countAcoesComSucessoClientesBase,
                color: "#46BFBD",
                highlight: "#5AD3D1",
                label: "Ações Sem Sucesso"
            }
        ];

        var graficoAcoesComSucesso = FLUIGC.chart($('#graficoAcoesComSucesso',this.sGetContext()));
        var pieChartAcoesComSucesso = graficoAcoesComSucesso.pie(dataAcoesComSucesso, null);

        var dataNaoClientes = [
            {
                value: countNovo - countAcoesComSucessoNovosClientes,
                color:"#0000FF",
                highlight: "#6495ED",
                label: "Clientes Novos Sem Sucesso"
            },
            {
                value: countAcoesComSucessoNovosClientes,
                color: "#008000",
                highlight: "#90EE90",
                label: "Clientes Novos Com Sucesso"
            }
        ];

        var graficoNaoClientes = FLUIGC.chart($('#graficoNaoClientes',this.sGetContext()));
        var pieChartNaoClientes = graficoNaoClientes.pie(dataNaoClientes, null);
        
        var dataNaoRealizados = [
            {
                value: countTotalRegistros - countAcoesNaoRealizadas,
                color:"#F7464A",
                highlight: "#FF5A5E",
                label: "Ações Planejadas"
            },
            {
                value: countAcoesNaoRealizadas,
                color: "#46BFBD",
                highlight: "#5AD3D1",
                label: "Ações Não Realizadas"
            }
        ];

        var graficoNaoRealizados = FLUIGC.chart($('#graficoAcoesNaoRealizadas',this.sGetContext()));
        var pieChartNaoRealizados = graficoNaoRealizados.pie(dataNaoRealizados, null);
        
        var graficoTotalVendas = FLUIGC.chart($('#graficoTotalVendas',this.sGetContext()), {
            id: 'gaugeVendasTotais',
            width: '250',
            height: '200'
        });
        var gaugeTotalVendas = graficoTotalVendas.gauge({
        	lines: 12,
            angle: 0.15,
            lineWidth: 0.44,
            pointer: {
                length: 0.9,
                strokeWidth: 0.035,
                color: '#000000'
            },
            limitMax: 'false',
            colorStart: '#6FADCF',
            colorStop: '#8FC0DA',
            strokeColor: '#E0E0E0',
            generateGradient: true
        });
        gaugeTotalVendas.maxValue = 3000; 
        gaugeTotalVendas.set(2500);
    },

	vLoadMap: function(campanha) {
		var _this = this;
		var numeroZoom = parseInt(_this.zoomClientes);

	   var meuMapa = jQuery('#google-map').gMap({

			maptype: 'ROADMAP',
			markers: _this.clientesMap,
			doubleclickzoom: true,
			controls: {
				panControl: true,
				zoomControl: true,
				mapTypeControl: true,
				scaleControl: false,
				streetViewControl: false,
				overviewMapControl: false
			},
			latitude: _this.clientesMap[0].latitude,
			longitude: _this.clientesMap[0].longitude,
			zoom: numeroZoom
		});

		var cityCenterLatLng = new google.maps.LatLng(_this.representanteLatitude, _this.representanteLongitude);  
	    var c = {  
	       strokeColor: "#ff0000",  
	       strokeOpacity: 0.6,
	       strokeWeight: 1,
	       fillColor: "#b0c4de",
	       fillOpacity: 0.50,
	       map: meuMapa.data('gMap.reference'),  
	       center: cityCenterLatLng,
	       radius: parseInt(_this.representanteRaio) * 1000,  
	       editable:false  
	    };
	 
	    var circle = new google.maps.Circle(c);
	},
	
	loadCampanhas: function() {
		var _this = this;
		var campanhaAnterior = '';
		
		var c1 = DatasetFactory.createConstraint('metadata#active', true, true, ConstraintType.MUST);
		var dataset = DatasetFactory.getDataset(_this.dsCampanhas, null, [c1], ["nmCampanha"]);
		var $optionSelecione = $("<option>", {
			"value": "",
			"text": "--Selecione--"
		});
		
		$('#slCampanha', _this.sGetContext()).append($optionSelecione);
		
		if (dataset != undefined && dataset.values.length > 0) {
			for (var i = 0; i < dataset.values.length; i++) {
				if(campanhaAnterior != dataset.values[i].nmCampanha) {
					var $option = $("<option>", {
						"value": dataset.values[i].codCampanha,
						"text": dataset.values[i].nmCampanha
					});
					
					$('#slCampanha', _this.sGetContext()).append($option);
					campanhaAnterior = dataset.values[i].nmCampanha;
				}
			}
		}
	},
	
	selectCampanha: function(el) {
		var _this = this;
		var campanhaVal = $('#slCampanha', _this.sGetContext()).val();

	    _this.clientesMap = [];
		if (el.value != "") {
			$('#linhaGraficos', _this.sGetContext()).css("display", "block");
			_this.initGraph(el.value);
			_this.vLoadMap(el.value);
		} else {
			$('#linhaGraficos', _this.sGetContext()).css("display", "none");
			_this.limparValoresCampanha();
		}
	},
	
	limparValoresCampanha: function() {
		$('#txtRepresentante',this.sGetContext()).text('');
		$('#txtAreaAtuacao',this.sGetContext()).text('');
		$('#txtTamanhoFunc',this.sGetContext()).text('');
		$('#txtValorTotal',this.sGetContext()).text('');
	},

	retornaDescricaoTamanho: function(indice) {
		var retorno = '';
		switch(indice) {
			case '1':
				retorno = 'De 1 à 4';
				break;
			case '2':
				retorno = 'De 5 à 9';
				break;
			case '3':
				retorno = 'De 10 à 19';
				break;
			case '4':
				retorno = 'De 20 à 49';
				break;
			case '5':
				retorno = 'De 50 à 99';
				break;
			case '6':
				retorno = 'De 100 à 249';
				break;
			case '7':
				retorno = 'De 250 à 499';
				break;
			case '8':
				retorno = 'De 500 à 999';
				break;
			case '9':
				retorno = 'De 1000 à 10000000';
				break;
			default:
				break;
		}
		return retorno;
	},

	stringToNumber: function(valor, arredondamento) {
		if(valor != undefined && valor != '') {
		 if (valor.indexOf(",") > -1) {
			valor = valor.replace(/\./g, "");
			valor = valor.replace(/\,/g, ".");
		 }
		 var num = parseFloat(valor);
		 return num;
		} else {
			return 0;
		}
	},

	formatMoney: function(valor, arredondamento, separadorDecimal, separadorMilhar) {
	 if(valor != undefined && valor != '') { 
	 valor = valor.toString();
	 if (valor.indexOf(",") > -1) {
		  valor = valor.replace(/\./g, "");
		  valor = valor.replace(/\,/g, ".");
		 }
		 var divisorMilhar = 3;
		 var re = '\\d(?=(\\d{' + (divisorMilhar || 3) + '})+'
		   + (arredondamento > 0 ? '\\D' : '$') + ')';
		 var num = parseFloat(valor).toFixed(Math.max(0, arredondamento));
		 num = num.toString();

		 var retorno = (separadorDecimal ? num.replace('.', separadorDecimal) : num).replace(new RegExp(re, 'g'), '$&' + (separadorMilhar || ''));
		 return retorno;
	 } else {
		 return "0,00";
	 }
	},

	getIconColor: function(cliente) {
		
		var urlIcon = "";
		
		if (cliente == "") {
			urlIcon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
		} else if (cliente == "1") {
			urlIcon = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
		} else if (cliente == "2") {
			urlIcon = "http://maps.google.com/mapfiles/ms/icons/purple-dot.png";
		} else if (cliente == "3") {
			urlIcon = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
		}
		
		var icon = {
				image: urlIcon,
				iconsize: [26, 46],
				iconanchor: [12,46]
			};
		
		/*
		 * http://maps.google.com/mapfiles/ms/icons/blue-dot.png
		 * http://maps.google.com/mapfiles/ms/icons/red-dot.png
		 * http://maps.google.com/mapfiles/ms/icons/purple-dot.png
		 * http://maps.google.com/mapfiles/ms/icons/yellow-dot.png
		 * http://maps.google.com/mapfiles/ms/icons/green-dot.png
		 */
		
		return icon;
	},
		
	/********/
	/*SHARED*/
	/********/
	sGetContext: function() {
		if (!this.context) {
			this.context = $('#MapaGuerraResultado_' + this.instanceId);
		}
		
		return this.context;
	}

}); 