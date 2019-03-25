import { Injectable } from '@angular/core';
import { Queue } from 'typescript-collections';
import { Task } from './task';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class TaskService {
	private tasks: Queue<Task>;
	private activeTaskChangeSubject: ReplaySubject<Task>;

	constructor() {
		this.tasks = new Queue<Task>();
		this.activeTaskChangeSubject = new ReplaySubject<Task>(1);
	}

	public activeTask: Task;
	public get activeTaskChanges(): Observable<Task> {
		return this.activeTaskChangeSubject.asObservable();
	}

	public enqueue(task: Task) {
		this.tasks.enqueue(task);
	}

	public dequeue() {
		this.tasks.dequeue();
	}

	public reset(): any {
		this.tasks.clear();
	}

	public async process(): Promise<void> {
		while (this.tasks.size() > 0) {
			this.activeTask = this.tasks.dequeue();
			this.activeTaskChangeSubject.next(this.activeTask);
			await this.activeTask.run();
		}
	}
}
