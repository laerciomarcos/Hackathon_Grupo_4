var MapaGuerraResultado = SuperWidget.extend({
	zoomClientes: null,
    dsCampanhas: 'acoesMapaVenda2',
	
	bindings: {
		local: {
			'edit-save': ['click_saveSettings']
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
		this.initGraph();
		this.vLoadMap();
	},
	
    initGraph: function() {
    	var that = this;
    	var campanha = 'TESTE1';
        var arrRetornoCampanha = [];
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

        if (dataset != undefined && dataset.values.length > 0) {
            for (var i = 0; i < dataset.values.length; i++) {
            	countTotalRegistros++;
            	arrRetornoCampanha.push({
            		codCampanha: dataset.values[i].codCampanha,
                    resultadoAcao: dataset.values[i].resultadoAcao,
                    tpCliente: dataset.values[i].tpCliente
                });
            	if(dataset.values[i].resultadoAcao == 'Ação Realizada Com Sucesso') {
            		countAcoesComSucesso++;
            	}
            	if(dataset.values[i].resultadoAcao == 'Ação Não Realizada') {
            		countAcoesNaoRealizadas++;
            	}
            	if(dataset.values[i].tpCliente == 'BASE') {
            		countBase++;
            		if(dataset.values[i].resultadoAcao == 'Ação Realizada Com Sucesso') {
            			countAcoesComSucessoClientesBase++;
            		}
            	} else {
            		countNovo++;
            		if(dataset.values[i].resultadoAcao == 'Ação Realizada Com Sucesso') {
            			countAcoesComSucessoNovosClientes++;
            		}
            	}
            }
        }

        var dataAcoesComSucesso = [
            {
                value: countAcoesComSucessoClientesBase,
                color:"#F7464A",
                highlight: "#FF5A5E",
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
                color:"#F7464A",
                highlight: "#FF5A5E",
                label: "Clientes Novos Sem Sucesso"
            },
            {
                value: countAcoesComSucessoNovosClientes,
                color: "#46BFBD",
                highlight: "#5AD3D1",
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
            width: '150',
            height: '120'
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

	vLoadMap: function() {
		var _this = this;
		var numeroZoom = parseInt(_this.zoomClientes);
		
		//_this.clientesMap = [];
		
		//var tipoCliente = $('#slTipoCliente', _this.sGetContext()).val();
		
		//var representanteMap = {};
		
		/*
		if (_this.representante != null) {
			
			representanteMap = {
									latitude: _this.representante.latitude,
									longitude: _this.representante.longitude,
									html: '<div style="width: 300px;"><h4 style="margin-bottom: 8px;">'+ _this.representante.nmRep +'</h4></div>',
									icon: _this.getIconColor("")
								}
			
			_this.clientesMap.push(representanteMap);
			
			
			if (tipoCliente == "1" || tipoCliente == "3") {
				_this.loadClientesByRepresentante();
			}
			
			if (tipoCliente == "2" || tipoCliente == "3") {
				_this.loadNaoClientes();
			}
		}*/

	   var meuMapa = jQuery('#google-map').gMap({

			maptype: 'ROADMAP',
			//markers: _this.clientesMap,
			doubleclickzoom: true,
			controls: {
				panControl: true,
				zoomControl: true,
				mapTypeControl: true,
				scaleControl: false,
				streetViewControl: false,
				overviewMapControl: false
			},
			//latitude: representanteMap.latitude,
			//longitude: representanteMap.longitude,
			zoom: numeroZoom
		});
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