// import { Component, ViewChild } from '@angular/core';
// import { Avatar } from '../../components/avatar/avatar';

// @Component({
//   selector: 'app-home',
//   standalone: true,
//   imports: [Avatar],
//   templateUrl: './home.html',
//   styleUrl: './home.scss',
// })
// export class Home {
//   @ViewChild(Avatar) avatar!: Avatar;

//   onHearFromMe(): void {
//     this.avatar.speak(
//       "Hi, I'm Tamilarasan. I'm a full stack dot net developer, " +
//       "and welcome to my AI portfolio."
//     );
//   }
// }



import { Component, ViewChild } from '@angular/core';
import { Avatar } from '../../components/avatar/avatar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Avatar],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  @ViewChild(Avatar) avatar!: Avatar;

  private readonly introText = `Hi, I'm Tamilarasan G, a full stack dot net developer based in Namakkal, India.

I have two years of experience building and maintaining web applications using C sharp, ASP dot net Core, M V C, and REST APIs. I work extensively with E F Core, A D O dot net, and Dapper for database operations, with a strong focus on MySQL.

Currently, I'm a software developer at Ainsurtech, where I develop insurance domain applications using clean architecture principles, design RESTful APIs for internal and third party integrations, and work on both standard CRUD operations and performance critical queries.

I hold a Bachelor's degree in Electronics and Communication Engineering, and I'm certified in ASP dot net Core Foundations and dot net Design Patterns.

Thanks for visiting my portfolio`;

  isPlaying = false;

  playIntro(): void {
    this.avatar.speak(this.introText, {
      onStart: () => (this.isPlaying = true),
      onEnd: () => (this.isPlaying = false),
    });
  }
}