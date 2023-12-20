export default function setColorScheme(scheme) {
  switch(scheme){
    case 'dark':
      document.color = 'dark'
      
      break;
    case 'light':
      document.color = 'light'
      // Light
      break;
    default:
      // Default
      document.color = 'dark'
      break;
  }
}

function getPreferredColorScheme() {
  if (window.matchMedia) {
    if(window.matchMedia('(prefers-color-scheme: dark)').matches){
      return 'dark';
    } else {
      return 'light';
    }
  }
  return 'dark';
}

function updateColorScheme(){
    if(document.color){
      window.location.reload();
    }
    setColorScheme(getPreferredColorScheme());
}

if(window.matchMedia){
  var colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  colorSchemeQuery.addEventListener('change', updateColorScheme);
}

updateColorScheme();