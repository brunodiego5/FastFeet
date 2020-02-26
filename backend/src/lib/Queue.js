import Bee from 'bee-queue';
import CancellationDelivery from '../app/jobs/CancellationDelivery';
import NewDelivery from '../app/jobs/NewDelivery';
import redisConifig from '../config/redis';

const jobs = [CancellationDelivery, NewDelivery];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConifig,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      // existe vatios tipos de eventos; failed, progress, ready...

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(` ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
