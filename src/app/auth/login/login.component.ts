import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  project!: FormGroup;
  data: any;
  constructor(private router: Router) {
    this.project = new FormGroup({
      username: new FormControl('', Validators.required),
      // password: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void { }

  onSave() {
    this.router.navigate(['/sidebar/dashboard'])
    // this.data = this.project.value;
    // if(this.data.username == 'More@1623'){
    //   this.router.navigate(['/sidebar/dashboard'])
    // }else{
    //   alert('Invalid User Name!')
    // }
    
    // if (this.data.username === 'anemoi' && this.data.password === 'anemoi') {
    //   localStorage.setItem('user', this.data.username);
    //   this.router.navigate(['/document/nav/config/role']);
    // } else {
    //   alert('Incorrect Crediantials....!!');
    //   this.project.reset();
    //   this.router.navigate(['/']);
    // }
    // this.loginService.login(this.project.value).subscribe((data) => {
    //   console.log(data, 'data');
    // })
    // console.log('save');
    
    // this.router.navigate(['headers/nav/dashboard'])


  }
}
