import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {LoaderService} from "../../../../shared/services/loader.service";
import {LoaderModel} from "../../../../shared/models/LoaderModel";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../auth/services/auth.service";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {RegisterValidator} from "../../../auth/validators/RegisterValidator";
import {debounceTime} from "rxjs/operators";
import {UserModel} from "../../models/UserModel";
import {UserValidator} from "../../validators/UserValidator";
import {ReviewService} from "../../../review/services/review.service";
import {ReviewModel} from "../../../review/models/ReviewModel";

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.scss']
})
export class MyprofileComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  user: UserModel = new UserModel();
  registerForm: FormGroup;
  submitted = false;
  range = [];
  panelOpenState = false;
  reviews: Array<ReviewModel> = [];
  currentUser: string;
  myuser: string;

  constructor(
    private us: UserService,
    private ls: LoaderService,
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private rs: ReviewService,
    private route: ActivatedRoute,
  ) {
    this.myuser = this.route.snapshot.queryParams["user"];
  }

  ngOnInit() {
    this.currentUser = localStorage.getItem('username');
    this.buildForm();
    if (this.myuser != undefined) {
      this.getOtherReviews();
      this.getOtherUser();
    } else {
      this.getMyProfile();
      this.getReviews();
    }

    for (var i = 0; i < 5; i++) {
      this.range.push(i);
    }
  }

  public isMarked = (index) => {
    if (this.user.rating >= index + 1) {
      return 'fas fa-star';
    } else if (this.user.rating > index && this.user.rating < index + 1) {
      return 'fas fa-star-half-alt';
    } else {
      return 'far fa-star';
    }
  };

  getOtherUser() {
    this.us.getOtherUser(this.myuser).subscribe(
      (response) => {
        this.user = response;
      }
    )
  }

  getMyProfile() {
    this.ls.update(new LoaderModel(true, null));
    this.us.getUser().subscribe((response) => {
      this.user = response.user;
      this.ls.update(null);
    })
  }

  connectUser(username) {
    let myusername = window.btoa(localStorage.getItem('username'));
    this.router.navigateByUrl('/stream?connection1=' + myusername + '&connection2=' + window.btoa(username));
  }

  getReviews() {
    this.rs.getReviews().subscribe(
      (response) => {
        this.reviews = response;
      }
    )
  }

  getOtherReviews() {
    this.rs.getOtherReviews(this.myuser).subscribe(
      (response) => {
        this.reviews = response;
      }
    )
  }

  // register() {
  //   this.isLoading = true;
  //   this.auth.register(this.user).subscribe(
  //     (succes) => {
  //       this.toastr.success('Succes', 'Te-ai inregistrat cu succes. Te rugam sa te autentifici.');
  //       this.isLoading = false;
  //       this.router.navigateByUrl('auth/login');
  //     },
  //     (error) => {
  //       this.isLoading = false;
  //       this.toastr.error('Eroare', 'Aceasta adresa de email este deja utilizata.');
  //     }
  //   );
  // }

  onSubmit(isvalid) {
    this.submitted = true;
    this.setObjectForm(this.registerForm.value);
    this.onValueChanged();
    if (isvalid) {
      // this.register();
    }
  }


  buildForm(): void {
    this.registerForm = this.fb.group({
      email: [this.user.email, [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$')]],
      password: [this.user.password, [Validators.required]],
      name: [this.user.name, [Validators.required]],
      price: [this.user.price, [Validators.required]],
      username: [this.user.username, [Validators.required]],
    }, {
      validator: UserValidator.validatePassowrd,
    });

    this.registerForm.valueChanges.pipe(debounceTime(500)).subscribe(data => {
      this.setObjectForm(data);
      this.onValueChanged();
    });
    this.onValueChanged();
  }

  onValueChanged() {
    if (!this.registerForm) {
      return;
    }

    for (let field in this.formErrors) {
      this.formErrors[field] = '';
      let control = this.registerForm.get(field);
      if (control && !control.valid) {
        let messages = this.validationMessages[field];
        for (let key in control.errors) {
          if (this.formErrors[field].length > 0) break;
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  formErrors = {
    'email': '',
    'password': '',
    'confirmPassword': '',
    'name': '',
    'username': '',
    'price': ''
  };

  validationMessages = {
    'email': {
      'required': 'Enter your email',
      'pattern': 'Email incorrect',
    },
    'password': {
      'required': 'Enter your password',
      'pattern': "Password must have at least 8 characters",
      'controlPassword': "Password must have at least 1 small and big letter & 1 number or character"
    },
    'name': {
      'required': 'Enter your full name',
    },
    'username': {
      'required': 'Enter your username',
      'pattern': 'Only letters allowed'
    },
    'price': {
      'required': 'Enter the price',
      'pattern': 'Only digits allowed'
    }
  };

  public setObjectForm(data: AbstractControl) {
    this.user.email = data['email'];
    this.user.password = data['password'];
    this.user.name = data['name'];
    this.user.username = data['username'];
  }


}
