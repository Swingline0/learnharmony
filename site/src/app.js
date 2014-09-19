import {appTemplate} from 'src/app.template';
import Editor from 'src/editor/editor';
import Console from 'src/console/console';
import AppRouter from 'src/app-router';
import {routes} from 'src/routes';

$('#app-container').html(appTemplate);

let editor = new Editor();
editor.render($('#app-container .editor-container'));

let console = new Console();
console.render($('#app-container .console-container'));

populateNav(routes);

new AppRouter(routes).start(mapPage);

function navEntry(route) {
  var result = `
<li>
  <a href="#${route.page}">${route.title}</a>
</li>`;

  return result;
}

function populateNav(routes) {
  let groupedRoutes = routes.filter(route => !!route.navGroup);
  groupedRoutes.forEach(route => $(route.navGroup).append(navEntry(route)));
}

function updateNav(url) {
  if(url === '/') url = '';
  $('.nav li').removeClass('active');
  let $active = $(`.nav li a[href="#${url}"]`);
  $active.closest('li').addClass('active');
  $active.closest('li').parent().closest('li').addClass('active');
}

function mapPage(pageName, url) {
  System.import(`src/pages/${pageName}.page`)
    .then(function({page}) {
      $('.heading').html(page.heading);
      $('.intro').html(page.intro);
      $('.editor').toggle(!page.hideEditor);
      editor.code = page.code || '';
      updateNav(url);
    }).catch(function(errors) {
      console.log('failed to load page: ', errors);
    });
}