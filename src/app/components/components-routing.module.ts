import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { IllegalComponent } from './illegal/illegal.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WrongSideComponent } from './wrong-side/wrong-side.component';
import { PersonCrossComponent } from './person-cross/person-cross.component';
import { OverSpeedComponent } from './over-speed/over-speed.component';
import { SpeedDropComponent } from './speed-drop/speed-drop.component';
import { TripWireComponent } from './trip-wire/trip-wire.component';
import { ObjectComponent } from './object/object.component';
import { FireComponent } from './fire/fire.component';
import { FogComponent } from './fog/fog.component';
import { LiveCameraComponent } from './live-camera/live-camera.component';
import { CameraTemperingComponent } from './camera-tempering/camera-tempering.component';
import { AnimalComponent } from './animal/animal.component';

const routes: Routes = [
  {
    path:'',component: SidebarComponent,
    children:[
      { path: 'dashboard', component: DashboardComponent }, 
      {path:'illegal' ,component: IllegalComponent},
      {path:'wrong' ,component: WrongSideComponent},
      {path:'person' ,component: PersonCrossComponent},
      {path:'overspeed' ,component: OverSpeedComponent},
      {path:'speed', component: SpeedDropComponent},
      {path:'trip', component:TripWireComponent},
      {path:'object', component:ObjectComponent},
      {path:'fire', component: FireComponent},
      {path:'fog', component: FogComponent},
      {path:'live', component:LiveCameraComponent},
      {path:'camera', component:CameraTemperingComponent},
      {path:'animal', component:AnimalComponent},
      
    ]
  }
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentsRoutingModule { }
