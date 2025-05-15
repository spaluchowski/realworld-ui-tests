import {GenericContainer, Network, StartedTestContainer, Wait} from 'testcontainers';
import { config } from './config';
import {StartedNetwork} from "testcontainers/build/network/network";

export class RealWorldApp {
  private network: StartedNetwork | undefined;
  private djangoContainer: StartedTestContainer | undefined;
  private angularContainer: StartedTestContainer | undefined;

  constructor() {
  }

  async start(): Promise<void> {
    this.network = await new Network().start();
    console.log(`Started Docker network: ${this.network}`);

    // Start Django backend container
    this.djangoContainer = await new GenericContainer(config.docker.djangoImage)
      .withExposedPorts(config.docker.djangoPort)
      .withNetwork(this.network)
      .withNetworkAliases('django-backend')
      .withWaitStrategy(Wait.forLogMessage('Starting development server at'))
      .start();

    console.log(`Started Django container: ${this.djangoContainer.getId()}`);
    console.log(`Django API is available at: http://localhost:${this.djangoContainer.getMappedPort(config.docker.djangoPort)}`);

    // Start Angular frontend container
    this.angularContainer = await new GenericContainer(config.docker.angularImage)
      .withExposedPorts(config.docker.angularPort)
      .withNetwork(this.network)
      .withNetworkAliases('angular-frontend')
      .withEnvironment({
        'API_URL': `http://django-backend:${config.docker.djangoPort}/api`
      })
      .withWaitStrategy(Wait.forLogMessage('Compiled successfully'))
      .start();

    console.log(`Started Angular container: ${this.angularContainer.getId()}`);
    console.log(`Angular app is available at: http://localhost:${this.angularContainer.getMappedPort(config.docker.angularPort)}`);
  }

  getBackendUrl(): string {
    return `http://localhost:${this.djangoContainer?.getMappedPort(config.docker.djangoPort)}`;
  }

  getFrontendUrl(): string {
    return `http://localhost:${this.angularContainer?.getMappedPort(config.docker.angularPort)}`;
  }

  async stop(): Promise<void> {
    if (this.angularContainer) {
      await this.angularContainer.stop();
      console.log('Stopped Angular container');
    }
    if (this.djangoContainer) {
      await this.djangoContainer.stop();
      console.log('Stopped Django container');
    }
    if (this.network) {
      await this.network.stop();
      console.log('Stopped Docker network');
    }
  }
}
