
function cb_re_draw_from_textbox(){
	var data_raw = $("#csvInput").val();
 	if( data_raw.indexOf("\n") < 0 || data_raw.indexOf("\t") < 0 ) {
 		return;
 	}
 	$("#loadingbox").css("display","none");
 	data_raw = data_raw.split("\n");
 	var rows = data_raw.length;
 	var cols = 0;
 	var data = [];
 	$.each( data_raw, function( idx, elem ){
 		if( elem.indexOf("\t") > -1 ){
 			var cells = elem.split("\t"); 
			data.push( cells );
			if( cols < cells.length ) {
				cols = cells.length;
			}
		}
 	});
 	
	$("#dataTableGrid").handsontable({
		data: data,
		startRows: rows,
		startCols: cols,
		rowHeaders: true,
		colHeaders: true,
		minSpareRows: 1,
		minSpareCols: 1,
		minRows : 5,
		minCols : 4,
		fillHandle: true,
		afterChange: cb_re_draw_from_gridbox
	});
}
function cb_re_draw_from_gridbox(){
	var grid = $('#dataTableGrid').handsontable('getInstance');
	var data = grid.getData();
	var tsv  = "";
	
	$.each( data, function(idx, row ){ 
		var row_count = row.length;
		var not_head   = idx !== 0 ? true : false;
		$.each( row, function( idx, cell ){ 
			if( cell ) {
				var cell_a = cell + "";
				//Format cells here
				
				// Remove commas
				if( not_head && idx !== 0 && cell_a.indexOf(",") > -1 ){
					cell_a = cell.replace( /,/gi, "" );
				}
				
				tsv += cell_a;
				if( row_count - 2 > idx ) {
					tsv += "\t";
				}
			}
				
		});
		// Remove trailing tab
		if( tsv.substring( tsv.length - 1, 1 ) === "\t" ) {
			tsv = tsv.substring( 0, tsv.length - 2 );
		}
		tsv +="\n";
	});
	$("#csvInput").val(tsv).trigger('keyup');
	
	
	var error     = $("#invalidDataSpan");
	var errorgrid = $("#invalidDataSpanGrid");
	errorgrid.attr( "class", error.attr("class") );
	if( errorgrid.attr('class') !== 'hide' ) {
		$("#staticContainer").css("visibility","hidden");
	} else {
		$("#staticContainer").css("visibility","visible");
	}
}
$(document).ready(function(){
	$("#clearchartdata").click(function(){
		var grid = $('#dataTableGrid').handsontable('getInstance');
		grid.loadData([[]]);
	});
})