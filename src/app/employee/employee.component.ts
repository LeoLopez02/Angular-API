import { Component, OnInit } from '@angular/core';

import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
})
export class EmployeeComponent implements OnInit {
  constructor(private http: HttpClient) {}

  departments: any = [];
  employees: any = [];

  EmployeeIdFilter = '';
  EmployeeNameFilter = '';
  employeesWithouthFilter: any = [];

  modalTitle = '';
  EmployeeId = 0;
  EmployeeName = '';
  Department = '';
  DateOfJoining = '';
  PhotoFileName = 'anonymous.png';
  PhotoPath = environment.PHOTO_URL;

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList() {
    this.http.get<any>(environment.API_URL + 'employee').subscribe((data) => {
      this.employees = data;
      this.employeesWithouthFilter = data;
    });
  }

  addClick() {
    this.modalTitle = 'Add Employee';
    this.EmployeeId = 0;
    this.EmployeeName = '';
    this.Department = '';
    this.DateOfJoining = '';
    this.PhotoFileName = 'anonymous.png';
  }

  editClick(emp: any) {
    this.modalTitle = 'Edit Employee';
    this.EmployeeId = emp.EmployeeId;
    this.EmployeeName = emp.EmployeeName;
    this.Department = emp.Department;
    this.DateOfJoining = emp.DateOfJoining;
    this.PhotoFileName = emp.PhotoFileName;
  }

  createClick() {
    var val = {
      EmployeeName: this.EmployeeName,
      Department: this.Department,
      DateOfJoining: this.DateOfJoining,
      PhotoFileName: this.PhotoFileName,
    };

    this.http.post(environment.API_URL + 'employee', val).subscribe((res) => {
      alert(res.toString());
      this.refreshList();
    });
  }

  updateClick() {
    var val = {
      EmployeeId: this.EmployeeId,
      EmployeeName: this.EmployeeName,
      Department: this.Department,
      DateOfJoining: this.DateOfJoining,
      PhotoFileName: this.PhotoFileName,
    };

    this.http.put(environment.API_URL + 'employee', val).subscribe((res) => {
      alert(res.toString());
      this.refreshList();
    });
  }

  deleteClick(id: any) {
    if (confirm('Are you sure you want to delete?')) {
      this.http
        .delete(environment.API_URL + 'employee/' + id)
        .subscribe((res) => {
          alert(res.toString());
          this.refreshList();
        });
    }
  }

  imageUpload(event: any) {
    var file = event.target.files[0];
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    this.http
      .post(environment.API_URL + 'employee/savefile', formData)
      .subscribe((data: any) => {
        this.PhotoFileName = data.toString();
      });
  }

  FilterFn() {
    var DepartmentIdFilter = this.EmployeeIdFilter;
    var DepartmentNameFilter = this.EmployeeNameFilter;

    this.departments = this.employeesWithouthFilter.filter(function (el: any) {
      return (
        el.DepartmentId.toString()
          .toLowerCase()
          .includes(DepartmentIdFilter.toString().trim().toLowerCase()) &&
        el.DepartmentName.toString()
          .toLowerCase()
          .includes(DepartmentNameFilter.toString().trim().toLowerCase())
      );
    });
  }

  sortResult(prop: any, asc: any) {
    this.departments = this.employeesWithouthFilter.sort(function (
      a: any,
      b: any
    ) {
      if (asc) {
        return a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 : 0;
      } else {
        return b[prop] > a[prop] ? 1 : b[prop] < a[prop] ? -1 : 0;
      }
    });
  }
}
