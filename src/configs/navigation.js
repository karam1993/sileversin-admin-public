export default {
  // main navigation - side menu
  menu: [{
    text: '',
    key: '',
    items: [
      { icon: 'mdi-view-dashboard-outline', key: 'menu.dashboard', link: '/' } ,
      { icon: 'mdi-account-group-outline', key: 'menu.users', link: '/users' } ,
      { icon: 'mdi-car-cog', key: 'menu.services', link: '/services' },
      // { icon: 'mdi-clipboard-list-outline', key: 'menu.tasks', link: '/tasks' },
      { icon: 'mdi-archive-outline', key: 'menu.packets', link: '/packets' } ,
      { icon: 'mdi-earth', key: 'menu.serviceArea', link: '/service-areas' } ,
      { icon: 'mdi-car-emergency', key: 'menu.serviceCars', link: '/service-cars' } ,
      { icon: 'mdi-calendar-range', key: 'menu.appointment', link: '/appointments' } ,
      { icon: 'mdi-clipboard-account-outline', key: 'menu.assignment', link: '/assignments' } ,
      { icon: 'mdi-calendar-cursor-outline', key: 'menu.order' , link: '/orders' } ,
      // { icon: 'mdi-calendar-cursor-outline', key: 'menu.order' , items : [
      //   { icon: 'mdi-format-list-bulleted-square', key: 'menu.list', link: '/orders' } ,
      //   { icon: 'mdi-map', key: 'menu.map', link: '/orders_map' }
        
      // ] } ,
      { icon: 'mdi-credit-card-wireless-outline', key: 'menu.payment', link: '/payments' } ,
      { icon: 'mdi-bell-ring-outline', key: 'menu.notification', link: '/notifications' } 
      
    ]
  }]
}
