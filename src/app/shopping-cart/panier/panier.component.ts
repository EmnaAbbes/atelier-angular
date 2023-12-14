import { Component,EventEmitter,Input, OnInit, Output} from '@angular/core';
import { EcommService } from '../ecomm.service';
@Component({
  selector: 'app-panier',
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.css']
})
export class PanierComponent  implements OnInit {

  constructor(private ecommService: EcommService) {}

  @Input() productAdded: any;

  total=0;
   
  addTotal(prix:number,qte:number){
    this.total+=prix*qte;
  }

  @Output() onOrderFinished = new EventEmitter();
  
  paymentHandler: any = null;

  stripeAPIKey: any = 'pk_test_51N29QlJcXDJf5UmY7XFNq1AUryWPFcKmIk0LGdIETU8qpViETr0lKlwa77EtjpsRs964yQhRv6IZPYue1Mg0dpOO00BL3gVk8V';

 

  ngOnInit() {
    this.invokeStripe();
  }

  checkoutProduct(){
    this.makePayment();
  }

  makePayment() {
    let amount = this.total
    const paymentHandler = (<any>window).StripeCheckout.configure({

      key: this.stripeAPIKey,

      locale: 'auto',

      token: (stripeToken : any) => {
        this.processPayment(amount, stripeToken);
      },
      
    });

    paymentHandler.open({

      name: 'ItSolutionStuff.com',

      description: '3 widgets',

      amount: amount * 100,

    });

  }

  

  invokeStripe() {

    if (!window.document.getElementById('stripe-script')) {

      const script = window.document.createElement('script');

      script.id = 'stripe-script';

      script.type = 'text/javascript';

      script.src = 'https://checkout.stripe.com/checkout.js';

      script.onload = () => {

        this.paymentHandler = (<any>window).StripeCheckout.configure({

          key: this.stripeAPIKey,

          locale: 'auto',

          token: function (stripeToken: any) {

            console.log(stripeToken);

            alert('Payment has been successfull!');

          },

        });

      };

  

      window.document.body.appendChild(script);

    }

  }

  
processPayment(amount:any,stripeToken:any){

    console.log(stripeToken);

    const data ={
      amount: amount* 100,
      token: stripeToken }
 
  this.ecommService.sendPayment(data)
  .subscribe({
    next: (res:any) => {
      console.log(res)
      alert("Operation sucessfully done")
          
            this.onOrderFinished.emit(false);

            this.total=0;
    },
    error: (e) => {
      console.log(e);
      alert("Error : Operation not done")
    },
  });
}

}
