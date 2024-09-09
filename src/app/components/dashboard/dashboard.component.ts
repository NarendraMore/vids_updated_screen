
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';

import { EventService } from 'src/app/service/event.service';
import { environment } from 'src/environments/environment';
import { ConfirmationService, MessageService } from "primeng/api";
import { DatePipe } from '@angular/common';

export interface camerastatus {
  ip: string;
  port: string;
  status: string;
  location: string;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [ConfirmationService, MessageService,DatePipe],
})
export class DashboardComponent {
  latestEvents: any[] = [];
  totalItems: number = 0;
  first: number = 0;
  currentPage: any = 1;
  itemsPerPage: number = 5;
  locationData: any[] = [];
  eventData: any[] = [];
  totalPages: number = 1;
  pages: number[] = [];
  searchText: string = '';
  equipments: any;
  eventName: any;
  latestEventUrl: any;
  CamerastatusArray: camerastatus[] = [];
  constructor(private eventservice: EventService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.currentPage = 1;
    sessionStorage.setItem("currentPage", this.currentPage);
    const savedPage = sessionStorage.getItem("currentPage");
    this.currentPage = savedPage ? parseInt(savedPage, 10) : 1;
    this.loadLatestEvents();
  }
  loadLatestEvents(): void {
    console.log('Loading data for page:', this.currentPage);
    this.eventservice.getLatestEvents(this.currentPage, this.itemsPerPage)
      .subscribe(
        (response: any) => {
          this.latestEvents = response.latestEvents;
          this.totalItems = response.totalItems;

          this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
          this.updatePagination();

          console.log(this.latestEvents, this.totalItems, 'latest event');
        },
        (error: HttpErrorResponse) => {
          console.error(error);
        }
      );
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadLatestEvents();
    }
  }


  updatePagination(): void {
    const totalVisiblePages = 3; // Number of pages to show
    let startPage: number, endPage: number;

    if (this.totalPages <= totalVisiblePages) {
      // Less pages than visible, show all pages
      startPage = 1;
      endPage = this.totalPages;
    } else {
      // More pages than visible
      if (this.currentPage <= 2) {
        // Near the start
        startPage = 1;
        endPage = totalVisiblePages;
      } else if (this.currentPage + 1 >= this.totalPages) {
        // Near the end
        startPage = this.totalPages - (totalVisiblePages - 1);
        endPage = this.totalPages;
      } else {
        // Somewhere in the middle
        startPage = this.currentPage - 1;
        endPage = this.currentPage + 1;
      }
    }

    this.pages = Array.from({ length: (endPage - startPage + 1) }, (_, i) => startPage + i);
  }
  dateForSearch: any;
  formattedDate: any;
  searchByDate(data: any) {
    console.log(data, "calender Date");
    this.formattedDate = this.datePipe.transform(data, "YYYY-MM-dd");

    // console.log(formattedDate, "Formatted Date");
    this.eventservice
      .getDataBySearchonDate(
        this.formattedDate,
        this.currentPage,
        this.itemsPerPage
      )
      .subscribe((data: any) => {
        console.log("formate data", data);
        this.latestEvents = data.latestEvents;
        this.totalItems = data.totalItems;
      });
  }
  clearDateFilter() {
    this.dateForSearch = null;
   this.ngOnInit()
  }
  filteredData() {
    if (!this.searchText) {
      return this.latestEvents;
    }
    return this.latestEvents.filter(item =>
      Object.values(item).some(val =>
        (val as string | number).toString().toLowerCase().includes(this.searchText.toLowerCase())
      )
    );
  }
  onclickCameraStatus() {
    this.eventservice.cameraStatus().subscribe((data: any) => {
      this.equipments = data;
      const uniqueIPs = new Set<string>();
      this.equipments = this.equipments.filter((equipment: { ip: string }) => {
        if (!uniqueIPs.has(equipment.ip)) {
          uniqueIPs.add(equipment.ip);
          return true;
        }
        return false;
      });
      this.CamerastatusArray = this.equipments;
      console.log("machine service", this.CamerastatusArray);

      // for(let i=0;this.equipments.length;i++){
      //   console.log(this.equipments[i].ip,'ip');
      // }
    });
  }

  // image code 
  onclickLatesevent(id: any, name: any) {
    this.eventName = name;

    this.latestEventUrl = `${environment.url}/getLatestImage/${id}`;
    this.eventservice.displayImage(id).subscribe(
      (eventData: any) => {
        console.log(eventData, "eventdata");
      },
      (error: HttpErrorResponse) => {
        console.error("Error:", error);
        const url = error.url;
        // console.log('URL:', url);
        this.latestEventUrl = url;
        console.log(this.latestEventUrl, "url");
      }
    );
  }
  onClickfalseDetection(id: any, event: any) {
    console.log('id', id);

    // alert('delete')
    this.confirmationService.confirm({
      message: "Are you sure that you want to Delete this Event?",
      accept: () => {
        this.eventservice.deleteFalseEvent(id).subscribe(
          (data: any) => {
            console.log(data, "deleted data");

            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: "Event Deleted Successfully",
            });

            this.ngOnInit();
          },
          (error: HttpErrorResponse) => {
            console.log(error, "error");

            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: `${error.error.developerMessage}`,
            });
            this.ngOnInit();
          }
        );
      },
      reject: () => {
        this.messageService.add({
          severity: "warn",
          summary: "Cancelled",
          detail: "Event not Deleted",
        });
      },
    });
  }
  onClickCancelPhoto() {
    this.latestEventUrl = "";
    // console.log('this.latestEventUrl',this.latestEventUrl);

  }
}
