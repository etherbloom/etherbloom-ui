import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
// import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistryComponent } from './pages/registry/registry.component';
import { HomeComponent } from './pages/home/home.component';
import { FAQComponent } from './components/faq/faq.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { FeatureComponent } from './components/feature/feature.component';
import { SampleArtComponent } from './components/sample-art/sample-art.component';
import { BloomComponent } from './components/bloom/bloom.component';
import { HoldersComponent } from './pages/holders/holders.component';
import { BloomAnimationComponent } from './components/bloom-animation/bloom-animation.component';
import { Web3ModalModule, Web3ModalService } from "@mindsorg/web3modal-angular";
import { PurchaseComponent } from './components/purchase/purchase.component';
import { BloomViewComponent } from './components/bloom-view/bloom-view.component';
import { BloomViewPanelComponent } from './components/bloom-view-panel/bloom-view-panel.component';
import { PostsComponent } from './components/posts/posts.component';
import { PostComponent } from './components/post/post.component';
import { Post2Component } from './components/post2/post2.component';
import { Art1Component } from './components/art1/art1.component';
import { Art2Component } from './components/art2/art2.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { BloomDetailComponent } from './components/bloom-detail/bloom-detail.component';
import { BloomPageComponent } from './pages/bloom-page/bloom-page.component';

@NgModule({
  declarations: [
    AppComponent,
    RegistryComponent,
    HomeComponent,
    FAQComponent,
    HeaderComponent,
    FooterComponent,
    FeatureComponent,
    SampleArtComponent,
    BloomComponent,
    HoldersComponent,
    BloomAnimationComponent,
    PurchaseComponent,
    BloomViewComponent,
    BloomViewPanelComponent,
    // FontAwesomeModule,
    PostsComponent,
    PostComponent,
    Post2Component,
    Art1Component,
    Art2Component,
    BloomDetailComponent,
    BloomPageComponent
  ],
  imports: [
    Web3ModalModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    OverlayModule,
    ToastrModule.forRoot(),
    SweetAlert2Module.forRoot(),
    NgbModule
  ],
  providers: [
    {
      provide: Web3ModalService,
      useFactory: () => {
        return new Web3ModalService({
          network: "mainnet", // optional
          cacheProvider: true, // optional
          providerOptions: {}, // required
          disableInjectedProvider: false
        });
      },
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule { }
