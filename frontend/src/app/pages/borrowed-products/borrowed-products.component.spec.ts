import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowedProductsComponent } from './borrowed-products.component';

describe('BorrowedProductsComponent', () => {
  let component: BorrowedProductsComponent;
  let fixture: ComponentFixture<BorrowedProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BorrowedProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BorrowedProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
