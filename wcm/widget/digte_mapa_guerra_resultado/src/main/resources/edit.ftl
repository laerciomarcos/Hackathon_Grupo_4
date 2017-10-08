<#attempt>

<#include "/fdwt_template/resources/js/ftl/params-tema.ftl">

<#if !zoomClientes??>
 <#assign zoomClientes = 5>
</#if>

<#assign parametros = "'editMode': true, 'zoomClientes': '${zoomClientes!5}'">

<#assign params = "{" + tema + ", " + parametros + "}">
<div id="MapaGuerraResultado_${instanceId}" 
	 class="super-widget wcm-widget-class fluig-style-guide fdwt-style-guide" 
	 data-params="MapaGuerraResultado.instance(${params})">
	
	<form class="form-horizontal edit-mode">
		<#include "/fdwt_template/resources/js/ftl/edit-abas.ftl">
		<div class="tab-content">
			<div class="tab-pane active" id="tema_${instanceId}">
				<#include "/fdwt_template/resources/js/ftl/edit-tema.ftl">
			</div>
			<div class="tab-pane" id="parametros_${instanceId}">
				<#include "edit-parametros.ftl">
			</div>
			<div class="tab-pane" id="icones_${instanceId}">
				<#include "/fdwt_template/resources/js/ftl/edit-icones.ftl">
			</div>
		</div>
		<#include "/fdwt_template/resources/js/ftl/edit-acoes.ftl">
	</form>
</div>

<#recover>
	<#include "/social_error.ftl">
</#attempt>
