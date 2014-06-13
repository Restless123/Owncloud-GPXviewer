function viewGpx(dir, file) {
  OC.addStyle('files_gpxviewer', 'leaflet');
  OC.addStyle('files_gpxviewer', 'leaflet.ie');
  OC.addStyle('files_gpxviewer', 'gpxviewer');
  OC.addScript('files_gpxviewer', 'leaflet').done(function(){OC.addScript('files_gpxviewer', 'gpx')}).done(function(){
    var location = fileDownloadPath(dir, file);
    console.log("Loading GPX from " + location);

    // fade out file list and show gpx canvas
    $('table').fadeOut('slow').promise().done(function(){
      var canvashtml = '<div id="gpx-canvas" style="width: 100%; height: 100%;"></div>';
      $('table').after(canvashtml);
      // in case we are on the public sharing page we shall display the gpx into the preview tag
      $('#preview').html(canvashtml);

      // use openstreetmap
      var map = new L.Map('gpx-canvas', {center: new L.LatLng(53, 8), zoom: 5});
      new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
      new L.GPX(location, {async: true}).on('loaded', function(e) {
        console.log("GPX loaded");
        map.fitBounds(e.target.getBounds());
      }).addTo(map);
    });
  });
}

function closegpxViewer(){
  // Fade out gpx-toolbar
  $('#gpx-toolbar').fadeOut('slow');
  // Fade out editor
  $('#gpx-canvas').fadeOut('slow', function(){
    $('#gpx-toolbar').remove();
    $('#gpx-canvas').remove();
    $('.actions,#file_access_panel').fadeIn('slow');
    $('table').fadeIn('slow');	
  });
  is_editor_shown = false;
}

$(document).ready(function() {
  if ($('#filesApp').val() && typeof FileActions!=='undefined'){
    FileActions.register('application/gpx','View', OC.PERMISSION_READ, '',function(filename){
      viewGpx($('#dir').val(),filename);
    });
    FileActions.setDefault('application/gpx','View');
  }

  $('#gpx_close').live('click',function() {
    closegpxViewer();	
  });
});
