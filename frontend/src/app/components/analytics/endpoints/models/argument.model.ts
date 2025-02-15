
/*
 * Magic Cloud, copyright Aista, Ltd. See the attached LICENSE file for details.
 */

/**
 * Lookup model describing lookup for a single field.
 */
export class Lookup {

  /**
   * Key/value in other table to associate with field.
   */
  key: string;

  /**
   * Field to display to end user as he selects a value.
   */
  name: string;

  /**
   * Name of table we're doing a lookup into.
   */
  table: string;

  /**
   * If true, this needs to use an autocomplete and not a select list.
   */
  long?: boolean;
}

/**
 * Argument model describing a single argument to an endpoint.
 */
export class Argument {

  /**
   * The name of the argument.
   */
  name: string;

  /**
   * The Hyperlambda type of the argument.
   */
  type: string;

  /**
   * If table is a foreign key into another table, this will contain that data.
   */
  lookup: Lookup;
}
