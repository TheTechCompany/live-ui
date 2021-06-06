export interface DependencyFunction {
  (name: string): unknown;
}

export interface DependencyTable {
  [props: string]: unknown;
}

export interface CreateRequires {
  (dependencies?: () => DependencyTable): (arg0: string) => unknown;
}

const sanitizeDependencies = (dependencies: any) =>
  typeof dependencies === "function" ? dependencies() : dependencies || {};

export const createRequires: CreateRequires = dependencies => {
  let isSanitized = false;
  let deps : any = {};

  return name => {
    if (!isSanitized) {
      // note: needs to happen inside the inner function for the laziness to work.
      deps = sanitizeDependencies(dependencies);
      isSanitized = true;
    }

    if ( !(name in deps)) {
      throw new Error(
        `Could not require '${name}'. '${name}' does not exist in dependencies.`
      );
    }

    return deps[name];
  };
};
