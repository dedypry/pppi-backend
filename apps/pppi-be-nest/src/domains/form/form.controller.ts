import { Body, Controller, Post } from '@nestjs/common';
import { FormService } from './form.service';
import { CreateFormDto } from './dto/create.dto';

@Controller('form')
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Post()
  createForm(@Body() body: CreateFormDto) {
    return this.formService.create(body);
  }
}
