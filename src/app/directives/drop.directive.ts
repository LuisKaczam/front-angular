import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FileHandle } from '../Files/FileHandle';

@Directive({
  selector: '[appDrop]'
})
export class DropDirective {
  @HostBinding("style.background") private bacground = "#ffffffe8";

  @Output() files: EventEmitter<FileHandle> = new EventEmitter()

  constructor(private sanitizer: DomSanitizer) { }
  
  @HostListener("dragover", ["$event"])
  public onDragOver(event: DragEvent){
    event.preventDefault();
    event.stopPropagation();
    this.bacground = "#a7a7a783";
  }

  @HostListener("dragleave", ["$event"])
  public onDragLeave(event: DragEvent){
    event.preventDefault();
    event.stopPropagation();
    this.bacground = "";
  }

  @HostListener("drop", ["$event"])
  public onDrop(event: DragEvent){
    event.preventDefault();
    event.stopPropagation();
    this.bacground = "#ffffffe8";

    let fileHandle: FileHandle = null!;

    const file = event.dataTransfer!.files[0];
    const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
    fileHandle = {file, url}

    this.files.emit(fileHandle)
  }
}
