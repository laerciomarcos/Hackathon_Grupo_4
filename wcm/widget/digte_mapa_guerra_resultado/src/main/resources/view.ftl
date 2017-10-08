<#attempt>

<#include "/fdwt_template/resources/js/ftl/params-tema.ftl">

<#assign parametros = "'zoomClientes': '${zoomClientes!5}'">

<#assign params = "{" + tema + ", " + parametros + "}">
<div id="MapaGuerraResultado_${instanceId}"
	 class="super-widget wcm-widget-class fluig-style-guide fdwt-style-guide"
	 data-params="MapaGuerraResultado.instance(${params})">
	
	<section class="fdwt-container fdwt-container_${instanceId}">
		<div id="fdwt-content" class="opacity-0">
			<#include "/fdwt_template/resources/js/ftl/view-header.ftl">
			<div id="collapse_${instanceId}" class="panel-collapse collapse in">
				<div class="content">
					<div class="row">
						<div class="col-md-10">
							<div class="row">
								<div class="col-md-12 form-group">
									<section id="google-map" class="gmap" style="height: 456px;"></section>
									<script type="text/javascript" src="https://maps.google.com/maps/api/js?key=AIzaSyDTmEWjcmSUco-dpbyiZ3oPHUHTNOORDKk"></script>
								</div>
							</div>
						</div>
						<div class="col-md-2">
							<div class="row">
								<div class="col-md-12 form-group">
									<lable for="slCampanha">Campanha</lable>
									<select id="slCampanha" name="slCampanha" class="form-control" data-view-changeCampanha>
									</select>
								</div>
							</div>
							<div class="row">
								<div class="col-md-12 form-group">
									<lable for="txtRepresentante"><strong>Representante</strong></lable>
									<div id="txtRepresentante"></div>
								</div>
							</div>
							<div class="row">
								<div class="col-md-12 form-group">
									<lable for="txtAreaAtuacao"><strong>Área de Atuação</strong></lable>
									<div id="txtAreaAtuacao"></div>
								</div>
							</div>
							<div class="row">
								<div class="col-md-12 form-group">
									<lable for="txtTamanhoFunc"><strong>Tamanho</strong></lable>
									<div id="txtTamanhoFunc"></div>
								</div>
							</div>
						</div>
					</div>
					<div class="row" id="linhaGraficos" style="margin-bottom: 30px; display: none;">
						<div class="col-md-3 form-group">
							<strong class="fs-text-capitalize" style="font-size:20px;text-transform:uppercase">Clientes</strong>
							<div id="graficoAcoesComSucesso"></div>
							<div class="row" style="margin-left: -2px;">Ações Em Clientes</div>
							<div class="row">
								<div class="col-md-2" style="background-color: #800080;">&nbsp;</div>
								<div class="col-md-10">Ações Com Sucesso</div>
							</div>
							<div class="row">
								<div class="col-md-2" style="background-color: #46BFBD;">&nbsp;</div>
								<div class="col-md-10">Ações Sem Sucesso</div>
							</div>
						</div>
						<div class="col-md-3 form-group">
							<strong class="fs-text-capitalize" style="font-size:20px;text-transform:uppercase">Leads</strong>
							<div id="graficoNaoClientes"></div>
							<div class="row">Ações Em Leads</div>
							<div class="row">
								<div class="col-md-2" style="background-color: #0000FF;">&nbsp;</div>
								<div class="col-md-10">Clientes Novos Sem Sucesso</div>
							</div>
							<div class="row">
								<div class="col-md-2" style="background-color: #008000;">&nbsp;</div>
								<div class="col-md-10">Clientes Novos Com Sucesso</div>
							</div>
						</div>
						<div class="col-md-3 form-group">
							<strong class="fs-text-capitalize" style="font-size:18px;text-transform:uppercase">Não Realizadas</strong>
							<div id="graficoAcoesNaoRealizadas"></div>
							<div class="row">Planejamento</div>
							<div class="row">
								<div class="col-md-2" style="background-color: #F7464A;">&nbsp;</div>
								<div class="col-md-10">Ações Planejadas</div>
							</div>
							<div class="row">
								<div class="col-md-2" style="background-color: #46BFBD;">&nbsp;</div>
								<div class="col-md-10">Ações Não Realizadas</div>
							</div>
						</div>
						<div class="col-md-3 form-group">
							<strong class="fs-text-capitalize" style="font-size:18px;text-transform:uppercase">Total Vendas</strong>
							<div id="graficoTotalVendas"></div>
							<div id="txtValorTotal" class="row"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</div>

<#include "/fdwt_template/resources/js/ftl/view-tema.ftl">

<#recover>
	<#include "/social_error.ftl">
</#attempt> 