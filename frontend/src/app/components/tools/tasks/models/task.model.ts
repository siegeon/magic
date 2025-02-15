
/*
 * Magic Cloud, copyright Aista, Ltd. See the attached LICENSE file for details.
 */

/**
 * Encapsulates a single task from your backend.
 */
export class Task {

  /**
   * Unique ID of task.
   */
  id: string;

  /**
   * Date when task was created.
   */
  created: Date;

  /**
   * Hyperlambda task contains.
   * 
   * Only returned from backend if we choose to retrieve task's details.
   */
  hyperlambda?: string;

  /**
   * Description of task in friendly human readable text.
   */
  description?: string;

  /**
   * List of schedules for task.
   */
  schedules?: Schedule[];
}

/**
 * A schedule for a scheduled task.
 */
export class Schedule {

  /**
   * Unique ID for schedule instance.
   */
  id: number;

  /**
   * Next due date for task.
   */
  due: Date;

  /**
   * Contains the repetition pattern of task, if task is repeating.
   */
  repeats?: string;
}
