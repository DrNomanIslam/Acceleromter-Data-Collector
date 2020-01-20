import { Component } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
import { Platform } from '@ionic/angular';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  private x:number;
  private y:number;
  private z:number;
  private msg:string;  

  private stringToWrite: string;
  private blob: Blob;  
  private fname:string;
  private fn:string;
  private subscription;
  private frequency: number;

  constructor(private platform: Platform,private file: File, private deviceMotion:DeviceMotion) {       
    this.x=0;
    this.y=0;
    this.z=0;
    this.fn="Normal";
    this.frequency=100;

    this.msg="Welcome to ACA Data Collector Moblie App";
  }

  
  


  start() {
    var self=this;
    this.fname= this.fn + Date.now() + ".csv";
    this.subscription = this.deviceMotion.watchAcceleration({frequency:self.frequency}).subscribe((acceleration: DeviceMotionAccelerationData) => {      
      console.log(acceleration);
      self.x=acceleration.x;
      self.y=acceleration.y;
      self.z=acceleration.z;
      self.stringToWrite = self.x + "," + self.y + "," + self.z +"\n";
      self.file.createFile(self.file.externalApplicationStorageDirectory, self.fname, true);      
      self.file.writeFile(self.file.externalApplicationStorageDirectory	 , self.fname, self.stringToWrite, {replace: false, append: true}).then((success) => {  
        self.msg="Saved to:  '" + self.fname + "'";
      }).catch((err) => {  
        self.msg = "Error Occured While Writing File" + err.message;  
      });
      
    });
  }
 

  stop() {
    this.subscription.unsubscribe();
  }
}