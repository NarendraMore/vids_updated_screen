import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EventService } from 'src/app/service/event.service';
import { environment } from 'src/environments/environment';


export interface trpwire {
  personCount: String;
  event: string;
  date: string;
  time: string;
  imagepath: string;
  cameratype: string;
  location: string;
  _id: string;
  name: string;
}
export interface formateData {
  formates: string;
}
export interface cameraNames {
  cameraTypes: string;
}
@Component({
  selector: 'app-trip-wire',
  templateUrl: './trip-wire.component.html',
  styleUrls: ['./trip-wire.component.css'],
  providers: [DatePipe],
})
export class TripWireComponent {
  @ViewChild("videoPlayer", { static: false }) videoPlayer!: | ElementRef | undefined;
  formate!: formateData[];
  cameraType!: cameraNames[];
  first: any = 1;
  currentPage: any = 1;
  itemsPerPage: any = 5;
  tripWieArray: trpwire[] = [];
  totalItems: number = 0;
  totalPages: number = 1;
  pages: number[] = [];
  searchText: string = '';
  downloadForm !: FormGroup;
  eventValue: any;
  today: any;
  tripwireImageUrl: any;
  tripWireVideoId: any;
  endDate: string = this.formatDate(new Date());
  startDate: string = this.formatDate(new Date());
  constructor(
    private eventService: EventService,
    private eventservice: EventService,
    private datePipe: DatePipe,
    private renderer: Renderer2

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
      event: new FormControl('Tripwire', [Validators.required]),
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
      startTime: new FormControl('', [Validators.required]),
      endTime: new FormControl('', [Validators.required]),
      formate: new FormControl('', [Validators.required]),
      cameratype: new FormControl('', [Validators.required]),
    });
  }
  loadLatestEvents(): void {
    let event = "Tripwire";
    this.eventService
      .getLatestEventByEvent(event, this.currentPage, this.itemsPerPage)
      .subscribe((tripwireData: any) => {
        console.log(tripwireData, "trip data");
        this.tripWieArray = tripwireData.latestEvents;
        this.totalItems = tripwireData.totalItems;
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
  filteredData() {
    if (!this.searchText) {
      return this.tripWieArray;
    }
    return this.tripWieArray.filter(item =>
      Object.values(item).some(val =>
        (val as string | number).toString().toLowerCase().includes(this.searchText.toLowerCase())
      )
    );
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
  onClickDownloadReport() {
    if (this.eventValue == 'Excel') {
      this.downLoad1();
    } else if (this.eventValue == 'PDF') {
      this.downLoad2();
    } else if (this.eventValue == 'CSV') {
      this.downLoad3();
    } else {
      console.error('Unknown event value');
    }

    this.downloadForm.reset();
  }

  tripWireVideoUrl: any;
  onClickShowvideo(id: any, name: any) {
    this.tripWireVideoUrl = `${environment.url}/playVideo/${id}`;

    this.reloadVideo();
  }
  reloadVideo(): void {
    if (this.videoPlayer && this.videoPlayer.nativeElement) {
      this.renderer.setAttribute(
        this.videoPlayer.nativeElement,
        "src",
        this.tripWireVideoUrl
      );
      this.videoPlayer.nativeElement.load();
    }
  }

  onClickCanclevideo() {
    this.tripWireVideoUrl = '';
  }
  onClickCanclePhoto() {
    this.tripwireImageUrl = '';
  }
  onClickShowphoto(id: any, name: any) {
    this.tripWireVideoId = id;
    this.tripwireImageUrl = `${environment.url}/getLatestImage/${id}`;

    this.eventService.displayImage(id).subscribe(
      (data: any) => {
        console.log(data, "speed Drop id wise data");
      },
      (error: HttpErrorResponse) => {
        console.error("Error:", error);
        const url = error.url;
        // console.log('URL:', url);
        this.tripwireImageUrl = url;
        console.log(this.tripwireImageUrl, "url");
      }
    );
  }
  downLoad1() {
    this.downloadForm.value.startDate = this.startDate;
    this.downloadForm.value.endDate = this.endDate
    console.log('excel file ');
    this.eventService.downloadPdfFormate(this.downloadForm.value).subscribe(
      (x: any) => {
        var newBlob = new Blob([x], { type: 'application/vnd.ms-excel' });
        const data = window.URL.createObjectURL(newBlob);
        var link = document.createElement('a');
        link.href = data;
        link.download = 'Vids Report.xlsx';
        link.dispatchEvent(
          new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
          })
        );
        console.log('file Downloded');
        // console.log(data,'download file');
        this.downloadForm.reset();
        this.ngOnInit();
      },
      (error: HttpErrorResponse) => {
        alert(error);
      }
    );
  }
  //pdf formate
  downLoad2() {
    this.downloadForm.value.startDate = this.startDate;
    this.downloadForm.value.endDate = this.endDate
    console.log('pdf file ');

    this.eventService
      .downloadPdfFormate1(this.downloadForm.value)
      .subscribe((x: any) => {
        console.log(this.downloadForm.value, 'pdf data  download');

        var newBlob = new Blob([x], { type: 'application/pdf' });
        const data = window.URL.createObjectURL(newBlob);
        var link = document.createElement('a');
        link.href = data;
        link.download = 'vds Data.pdf';
        link.dispatchEvent(
          new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
          })
        );
        console.log('file Downloded');
        // console.log(data,'download file');
        this.ngOnInit();
        this.downloadForm.reset();
      },
        (error: HttpErrorResponse) => {
          alert(error);
        });
  }
  downLoad3() {
    this.downloadForm.value.startDate = this.startDate;
    this.downloadForm.value.endDate = this.endDate
    console.log('csv file ');
    // csv formate
    this.eventService
      .downloadPdfFormate2(this.downloadForm.value)
      .subscribe((x: any) => {
        var newBlob = new Blob([x], { type: 'text/csv' });
        const data = window.URL.createObjectURL(newBlob);
        var link = document.createElement('a');
        link.href = data;
        link.download = 'vds Data.csv';
        link.dispatchEvent(
          new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
          })
        );
        console.log('file Downloded');
        // console.log(data,'download file');
        this.downloadForm.reset();
        this.ngOnInit();
      },
        (error: HttpErrorResponse) => {
          alert(error);
        });
  }
  formattedDate: any
  dateForSearch: any;
  searchByDate(data: any) {
    console.log(data, "calender Date");
    this.formattedDate = this.datePipe.transform(data, "YYYY-MM-dd");
    let event = "Tripwire";
    console.log(this.formattedDate, "Formatted Date");
    this.eventService
      .getDataBySearchonDate1(
        event,
        this.formattedDate,
        sessionStorage.getItem("currentPage"),
        this.itemsPerPage
      )
      .subscribe((data: any) => {
        console.log("formate data", data);
        this.tripWieArray = data.latestEvents;
        this.totalItems = data.totalItems;
      });
  }
  clearDateFilter() {
    this.dateForSearch = null;
    this.ngOnInit()
  }
}
