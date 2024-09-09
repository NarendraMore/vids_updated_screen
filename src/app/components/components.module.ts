import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsRoutingModule } from './components-routing.module';
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
import { SharedModuleModule } from '../shared/shared.module';
import { AuthRoutingModule } from '../auth/auth-routing.module';


@NgModule({
  declarations: [
    SidebarComponent,
    IllegalComponent,
    DashboardComponent,
    WrongSideComponent,
    PersonCrossComponent,
    OverSpeedComponent,
    SpeedDropComponent,
    TripWireComponent,
    ObjectComponent,
    FireComponent,
    FogComponent,
    LiveCameraComponent,
    CameraTemperingComponent,
    AnimalComponent,

  ],
  imports: [
    CommonModule,
    ComponentsRoutingModule,
    SharedModuleModule,
    AuthRoutingModule
  ]
})
export class ComponentsModule { }
