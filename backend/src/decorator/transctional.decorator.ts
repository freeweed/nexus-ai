import { DataSource } from 'typeorm';

export function Transactional() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const dataSource: DataSource = this.dataSource;

      if (!dataSource || !(dataSource instanceof DataSource)) {
        throw new Error('Missing dataSource: please inject DataSource into the class.');
      }

      return await dataSource.transaction(async (manager) => {
        this.manager = manager;
        return await originalMethod.apply(this, args);
      });
    };

    return descriptor;
  };
}
