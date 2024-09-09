import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  navData: any = [];
  activePanel: string | null = null;
  activeMenu: string | null = null;
  isSidebarCollapsed: boolean = false;

  dashboard: string = '/dashboard';
  illegal: string = '/illegal '
  luggage: string = '/luggage'
  vehicle: string = '/vehicle'
  constructor(private router: Router) { }
  ngOnInit() {
    // this.navData = [
    //   {
    //     routeLink: "dashboard",
    //   },

    // ]
    this.router.events.subscribe(event => {
      // console.log('event', event);

      if (event instanceof NavigationEnd) {
        this.setActiveMenu(event.url);
      }
    });
    // this.setActiveMenu();


  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  togglePanel(panel: string): void {
    // console.log('panel', panel);
    this.activePanel = this.activePanel === panel ? null : panel;
    $('.panel').not(`.${panel}`).removeClass('active');

  }
  setActiveMenu(url: any) {
    const currentRoute = url;
    if (currentRoute.includes('dashboard')) {
      this.activeMenu = 'total'
    } else if (currentRoute.includes('illegal')) {
      this.activeMenu = 'illegal';
    } else if (currentRoute.includes('wrong')) {
      this.activeMenu = 'wrong';
    } else if (currentRoute.includes('person')) {
      this.activeMenu = 'person';
    } else if (currentRoute.includes('overspeed')) {
      this.activeMenu = 'overspeed';
    } else if (currentRoute.includes('speed')) {
      this.activeMenu = 'speed';
    }else if (currentRoute.includes('trip')) {
      this.activeMenu = 'trip';
    }else if (currentRoute.includes('object')) {
      this.activeMenu = 'object';
    }else if (currentRoute.includes('fire')) {
      this.activeMenu = 'fire';
    }else if (currentRoute.includes('fog')) {
      this.activeMenu = 'fog';
    }else if (currentRoute.includes('live')) {
      this.activeMenu = 'live';
    }else if (currentRoute.includes('camera')) {
      this.activeMenu = 'camera';
    }else if (currentRoute.includes('animal')) {
      this.activeMenu = 'animal';
    }
  }

  displayMenu(menuName: string) {
    if (menuName == 'illegal') {
      this.activeMenu = this.activeMenu === menuName ? null : menuName;
    } else if (menuName == 'vehicle') {
      this.activeMenu = this.activeMenu === menuName ? null : menuName;
    } else if (menuName == 'luggage') {
      this.activeMenu = this.activeMenu === menuName ? null : menuName;
    }
  }
  logOut(){
    this.router.navigate(['/'])
  }
}
