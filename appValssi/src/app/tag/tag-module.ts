import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TagRoutingModule } from './tag-routing-module';
import { TagForm } from './tag-form/tag-form';
import { TagIndex } from './tag-index/tag-index';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [
    TagForm,
    TagIndex
  ],
  imports: [
    CommonModule,
    TagRoutingModule,
    MatIcon, 
    TranslateModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,


  ]
})
export class TagModule { }
