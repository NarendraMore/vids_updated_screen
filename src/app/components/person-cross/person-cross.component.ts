import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EventService } from 'src/app/service/event.service';
import { environment } from 'src/environments/environment';
export interface personCross {
  vehiclecount: string;
  vehicletype: string;
  date: string;
  time: string;
  cameratype: string;
  location: string;
  event:string;
  _id:string;
  name:string;
}
export interface formateData {
  formates: string;
}
export interface cameraNames {
  cameraTypes: string;
}
@Component({
  selector: 'app-person-cross',
  templateUrl: './person-cross.component.html',
  styleUrls: ['./person-cross.component.css'],
  providers: [DatePipe]
})
export class PersonCrossComponent {
  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef | undefined;
  first: any = 1;
  currentPage: any = 1;
  itemsPerPage: any = 5;
  personCrossArray: personCross[] = [];
  totalItems: number = 0;
  totalPages: number = 1;
  searchText: string = '';
  pages: number[] = [];
  personCrossVideoId: any;
  personCrossImageId: any;
  cameraType!: cameraNames[];
  personcrossImageUrl: any;
  downloadForm!:FormGroup;
  today:any
  formate!: formateData[];
  endDate: string = this.formatDate(new Date());
  startDate: string = this.formatDate(new Date());
  eventValue:any
  constructor(private eventService: EventService,
    private renderer: Renderer2,
    private datePipe: DatePipe
  ) { }
  ngOnInit() {
    this.loadLatestEvents();
    this.downloadForm = new FormGroup({
      event: new FormControl('Personcross',  [Validators.required]),
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
      startTime: new FormControl('', [Validators.required]),
      endTime: new FormControl('', [Validators.required]),
      formate: new FormControl('', [Validators.required]),
      cameratype: new FormControl('', [Validators.required]),
    })
  }
  loadLatestEvents(): void {
    const event = 'Personcross';
    this.eventService
      .getLatestEventByEvent(event, this.currentPage, this.itemsPerPage)
      .subscribe((personCrossData: any) => {
        console.log(personCrossData, 'person cross data');
        this.personCrossArray = personCrossData.latestEvents;
        this.totalItems = personCrossData.totalItems;
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
      return this.personCrossArray;
    }
    return this.personCrossArray.filter(item =>
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
  onClickShowphoto(id: any, name: any) {
  
    this.personCrossImageId = id;
    this.personcrossImageUrl = `${environment.url}/getLatestImage/${id}`;
    this.eventService.displayImage(this.personCrossImageId).subscribe(
      (data: any) => {
        console.log(data, 'person cross id wise data');
      },
      (error: HttpErrorResponse) => {
        console.error('Error:', error);
        const url = error.url;
        // console.log('URL:', url);
        this.personcrossImageUrl = url;
        console.log(this.personcrossImageUrl, 'url');
      }
    );
  }
  personCrossUrl: any;
  onClickShowvideo(id: any) {
    this.personCrossUrl = `${environment.url}/playVideo/${id}`;
    this.reloadVideo();
  }
  reloadVideo(): void {
    if (this.videoPlayer && this.videoPlayer.nativeElement) {
      this.renderer.setAttribute(this.videoPlayer.nativeElement, 'src', this.personCrossUrl);
      this.videoPlayer.nativeElement.load();
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
  onDateChange1(event: any) {
    const selectedDate: Date = event.target.valueAsDate;

    if (selectedDate) {
      this.startDate = this.formatDate(selectedDate);
    }
  }
  formatDate1(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  onclickcameraEvent(event: any) {
    console.log(event.value, 'camera event value');
  }
  onDropdownChange(event: any) {
    this.eventValue = event.value;
    console.log(this.eventValue, 'event value');
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
    }
    this.downloadForm.reset();
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
  formattedDate:any
  dateForSearch: any;
  searchByDate(data: any) {
    console.log(data, "calender Date");
    this.formattedDate = this.datePipe.transform(data, "YYYY-MM-dd");
    let event = "Personcross";
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
        this.personCrossArray = data.latestEvents;
        this.totalItems = data.totalItems;
      });
  }
  clearDateFilter() {
    this.dateForSearch = null;
   this.ngOnInit()
  }
  onClickCanclePhoto(){
    this.personcrossImageUrl ='';
  }
  onClickCanclevideo(){
    this.personCrossUrl ='';
  }
}

