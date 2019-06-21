import {Component, ElementRef, OnInit, Renderer, Renderer2, ViewChild} from '@angular/core';
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
import {StatisticsService} from "../../../statistics/services/statistics.service";

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
  imagePreview: string;
  userImage: File;

  categoriesList = [
    {title: 'A.I.', class: 'fas fa-robot'},
    {title: 'ANALYTICS', class: 'fas fa-chart-pie'},
    {title: 'ANIMALS', class: 'fas fa-dragon'},
    {title: 'AUDIO', class: 'fas fa-headphones'},
    {title: 'AUTOMOTIVE', class: 'fas fa-car'},
    {title: 'BUILDINGS', class: 'fas fa-building'},
    {title: 'CODING', class: 'fas fa-code'},
    {title: 'COMPUTERS', class: 'fas fa-laptop'},
    {title: 'DATABASE', class: 'fas fa-database'},
    {title: 'DESIGN', class: 'fas fa-palette'},
    {title: 'GAMING', class: 'fas fa-gamepad'},
    {title: 'HEALTH', class: 'fas fa-heart'},
    {title: 'MARKETING', class: 'fas fa-bullhorn'},
    {title: 'MATHEMATICS', class: 'fas fa-superscript'},
    {title: 'NETWORK', class: 'fas fa-sitemap'},
    {title: 'SCHOOL', class: 'fas fa-user-graduate'},
    {title: 'SCIENCE', class: 'fas fa-atom'},
    {title: 'WRITING', class: 'fas fa-pencil-alt'},
  ];


  constructor(
    private us: UserService,
    private ls: LoaderService,
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private rs: ReviewService,
    private route: ActivatedRoute,
    private ss: StatisticsService
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

  public isMarkedReviews = (index, rating) => {
    if (rating >= index + 1) {
      return 'fas fa-star';
    } else if (rating > index && rating < index + 1) {
      return 'fas fa-star-half-alt';
    } else {
      return 'far fa-star';
    }
  };

  getOtherUser() {
    this.us.getOtherUser(this.myuser).subscribe(
      (response) => {
        this.user = response;
        this.imagePreview = this.user.imagePath;
        this.addStatistic();
      }
    )
  }

  addStatistic() {
    this.ss.addStatProfile(this.user.username).subscribe();
  }

  getMyProfile() {
    this.ls.update(new LoaderModel(true, null));
    this.us.getUser().subscribe((response) => {
      this.user = response.user;
      this.imagePreview = this.user.imagePath;
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

  onImagePicked(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.userImage = file;
    const reader = new FileReader();
    reader.onload = () => {
      // this.imagePreview = reader.result as string;
      this.changeUserImage();
    };
    reader.readAsDataURL(file);
  }

  getOtherReviews() {
    this.rs.getOtherReviews(this.myuser).subscribe(
      (response) => {
        this.reviews = response;
      }
    )
  }

  updateUser() {
    this.ls.update(new LoaderModel(true, null));
    this.us.updateUser(this.user).subscribe(
      (succes) => {
        this.toastr.success('Success', 'You updated your profile.');
        this.ls.update(null);
      },
      (error) => {
        this.toastr.error('Error', 'Profile update failed.');
        this.ls.update(null);
      }
    );
  }

  changeUserImage() {
    this.ls.update(new LoaderModel(true, null));
    this.us.changeUserImage(this.userImage).subscribe(
      (succes) => {
        this.toastr.success('Success', 'You changed your photo.');
        this.ls.update(null);
      },
      (error) => {
        this.toastr.error('Error', 'Profile update failed.');
        this.ls.update(null);
      }
    );
  }

  onSubmit(isvalid) {
    this.submitted = true;
    this.setObjectForm(this.registerForm.value);
    this.onValueChanged();
    if (isvalid) {
      this.updateUser();
    }
  }


  buildForm(): void {
    this.registerForm = this.fb.group({
      email: [this.user.email, [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$')]],
      password: [this.user.password, [Validators.required]],
      name: [this.user.name, [Validators.required]],
      price: [this.user.price, [Validators.required]],
      username: [this.user.username, [Validators.required]],
      description: [this.user.description],
      categories: [this.user.categories],
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
