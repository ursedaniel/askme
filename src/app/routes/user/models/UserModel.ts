export class UserModel {
  email: string;
  password: string;
  confirmPassword: string;
  name:string;
  username:string;
  id: number;
  online: boolean;
  reviews: number;
  rating: number;
  price: number;
  type: string;
  joinDate: string;
  description: string;
  categories: Array<string>;
  imagePath: any;
  constructor() {
  }
}

