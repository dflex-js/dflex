interface CarOptions {
  make: string;
  model: string;
  year: number;
}

interface BikeOptions {
  brand: string;
  type: string;
  year: number;
}

function createVehicle(options: CarOptions): void;
function createVehicle(options: BikeOptions): void;

function createVehicle(options: CarOptions | BikeOptions): void {
  // Your implementation here
  console.log(`Creating vehicle with year ${options.year}`);
}

createVehicle({ make: "", brand: 9, model: "" });
