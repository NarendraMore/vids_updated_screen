import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { EventService } from 'src/app/service/event.service';
import { environment } from 'src/environments/environment';
export interface wrongside {
  vehiclecount: string;
  vehicletype: string;
  date: string;
  time: string;
  cameratype: string;
  location: string;
  _id: string;
  event: string;
  name: string;
}
export interface formateData {
  formates: string;
}
export interface cameraNames {
  cameraTypes: string;
}
@Component({
  selector: 'app-wrong-side',
  templateUrl: './wrong-side.component.html',
  styleUrls: ['./wrong-side.component.css'],
  providers:[DatePipe]
})
export class WrongSideComponent {
  @ViewChild("videoPlayer", { static: false }) videoPlayer!:| ElementRef | undefined;
  currentPage: any = 1;
  itemsPerPage: any = 5
  wrongSideArray: wrongside[] = [];
  totalItems: number = 0;
  Wrongside: any;
  searchText: string = '';
  totalPages: number = 1;
  pages: number[] = [];
  wrongsideId: any;
  wrongSideImageUrl: any;
  wrongSideVideoUrl: any;
  wrongsidevideoId: any;
  downloadForm!: FormGroup
  eventValue:any
  today: any;
  formate!: formateData[];
  cameraType!: cameraNames[];
  endDate: string = this.formatDate(new Date());
  startDate: string = this.formatDate(new Date());
  constructor(private eventservice: EventService,
    private renderer: Renderer2,
    private datePipe: DatePipe,
  ) { 
    this.formate = [
      { formates: "PDF" },
      { formates: "CSV" },
      { formates: "Excel" },
    ];
    this.cameraType = [
      { cameraTypes: "All camera" },
      { cameraTypes: "71-Honeywell" },
      { cameraTypes: "73-Honeywell" },
      { cameraTypes: "76-Honeywell" },
      { cameraTypes: "77-Honeywell" },
      { cameraTypes: "139-Hikvision" },
      { cameraTypes: "157-Hikvision" },
      { cameraTypes: "158-Hikvision" },
    ];
  }
  ngOnInit() {
    this.loadLatestEvents();
    this.downloadForm = new FormGroup({
      event: new FormControl('Wrong_Side', [Validators.required]),
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
      startTime: new FormControl('', [Validators.required]),
      endTime: new FormControl('', [Validators.required]),
      formate: new FormControl('', [Validators.required]),
      cameratype: new FormControl('', [Validators.required]),
    });
  }
  loadLatestEvents(): void {
    let event = "Wrong_Side";
    this.eventservice
      .getLatestEventByEvent(event, this.currentPage, this.itemsPerPage)
      .subscribe((wrongSideData: any) => {
        console.log(wrongSideData, "Wrongside Data");
        this.wrongSideArray = wrongSideData.latestEvents;
        this.Wrongside = wrongSideData;
        this.totalItems = wrongSideData.totalItems;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.updatePagination();
      });
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

  filteredData() {
    if (!this.searchText) {
      return this.wrongSideArray;
    }
    return this.wrongSideArray.filter(item =>
      Object.values(item).some(val =>
        (val as string | number).toString().toLowerCase().includes(this.searchText.toLowerCase())
      )
    );
  }
  onClickShowphoto(id: any) {

    // console.log(this.Wrongside[i]._id,'ujfgjkghuj');
    this.wrongsideId = id;
    this.wrongSideImageUrl = `${environment.url}/getLatestImage/${id}`;

    this.eventservice.displayImage(id).subscribe(
      (data: any) => {
        console.log(data, "wrong side id wise data");
      },
      (error: HttpErrorResponse) => {
        console.error("Error:", error);
        const url = error.url;
        // console.log('URL:', url);
        this.wrongSideImageUrl = url;
        console.log(this.wrongSideImageUrl, "url");
      }
    );
  }
  onClickShowwrongsidevideo(id: any, name: any) {
    this.wrongSideVideoUrl = `${environment.url}/playVideo/${id}`;
    this.wrongsidevideoId = id;

    this.eventservice.playVideoApi(id).subscribe(
      (data: any) => {
        console.log(data, "wrong side video id wise data");
      },
      (error: HttpErrorResponse) => {
        console.error("Error:", error.url);
        const url = error.url;
        this.wrongSideVideoUrl = url;
      }
    );
    this.reloadVideo();
  }
  reloadVideo(): void {
    if (this.videoPlayer && this.videoPlayer.nativeElement) {
      this.renderer.setAttribute(
        this.videoPlayer.nativeElement,
        "src",
        this.wrongSideVideoUrl
      );
      this.videoPlayer.nativeElement.load();
    }
  }
  onClickCanclevideo() {
    this.wrongSideVideoUrl = '';
  }
  onClickCanclePhoto() {
    this.wrongSideImageUrl = '';
  }
  formattedDate: any
  dateForSearch: any;
  searchByDate(data: any) {
    console.log(data, "calender Date");
    this.formattedDate = this.datePipe.transform(data, "YYYY-MM-dd");
    let event = "Tripwire";
    console.log(this.formattedDate, "Formatted Date");
    this.eventservice
      .getDataBySearchonDate1(
        event,
        this.formattedDate,
        sessionStorage.getItem("currentPage"),
        this.itemsPerPage
      )
      .subscribe((data: any) => {
        console.log("formate data", data);
        this.wrongSideArray = data.latestEvents;
        this.totalItems = data.totalItems;
      });
  }
  clearDateFilter() {
    this.dateForSearch = null;
    this.ngOnInit()
  }

  onDateChange1(event: any) {
    const selectedDate: Date = event.target.valueAsDate;

    if (selectedDate) {
      this.startDate = this.formatDate(selectedDate);
    }
  }
  onDateChange(event: any) {
    const selectedDate: Date = event.target.valueAsDate;

    if (selectedDate) {
      this.endDate = this.formatDate(selectedDate);
    }
  }
  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  onclickcameraEvent(event: any) {
    console.log(event.value, 'camera event value');
  }
  onDropdownChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.eventValue = selectElement.value;
    console.log('Selected Value:', this.eventValue);
  }
  onClickCancel() {
    this.downloadForm.reset();
    this.ngOnInit();
  }
}
