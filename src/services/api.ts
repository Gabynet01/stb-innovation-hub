import { IdeasApiService } from "./ideasApi";
import { AuthApiService } from "./authApi";
import { IdeaCatalogApiService } from "./ideaCatalogApi";
import { IdeaAssessmentsApiService } from "./ideaAssessmentsApi";
import {
  UsersApiService,
  RolesApiService,
  GroupsApiService,
  PermissionsApiService,
  AdMappingsApiService,
} from "./directoryApi";
import { DocumentTemplatesApiService } from "./documentTemplatesApi";
import { DocumentsApiService } from "./documentsApi";
import { IdeaInsightsApiService } from "./ideaInsightsApi";
import { BaseApiService } from "./baseApi";

export class ApiService extends BaseApiService {
  public ideas: IdeasApiService;
  public auth: AuthApiService;
  public catalog: IdeaCatalogApiService;
  public assessments: IdeaAssessmentsApiService;
  public documentTemplates: DocumentTemplatesApiService;
  public documents: DocumentsApiService;
  public ideaInsights: IdeaInsightsApiService;
  public users: UsersApiService;
  public roles: RolesApiService;
  public groups: GroupsApiService;
  public permissions: PermissionsApiService;
  public adMappings: AdMappingsApiService;

  constructor(timeout?: number) {
    super(timeout);
    this.ideas = new IdeasApiService(timeout);
    this.auth = new AuthApiService(timeout);
    this.catalog = new IdeaCatalogApiService(timeout);
    this.assessments = new IdeaAssessmentsApiService(timeout);
    this.documentTemplates = new DocumentTemplatesApiService(timeout);
    this.documents = new DocumentsApiService(timeout);
    this.ideaInsights = new IdeaInsightsApiService(timeout);
    this.users = new UsersApiService(timeout);
    this.roles = new RolesApiService(timeout);
    this.groups = new GroupsApiService(timeout);
    this.permissions = new PermissionsApiService(timeout);
    this.adMappings = new AdMappingsApiService(timeout);

    const sync = (s: BaseApiService) => s.setBaseUrl(this.baseUrl);
    sync(this.ideas);
    sync(this.auth);
    sync(this.catalog);
    sync(this.assessments);
    sync(this.documentTemplates);
    sync(this.documents);
    sync(this.ideaInsights);
    sync(this.users);
    sync(this.roles);
    sync(this.groups);
    sync(this.permissions);
    sync(this.adMappings);
  }

  setBaseUrl(url: string): void {
    super.setBaseUrl(url);
    this.ideas.setBaseUrl(url);
    this.auth.setBaseUrl(url);
    this.catalog.setBaseUrl(url);
    this.assessments.setBaseUrl(url);
    this.documentTemplates.setBaseUrl(url);
    this.documents.setBaseUrl(url);
    this.ideaInsights.setBaseUrl(url);
    this.users.setBaseUrl(url);
    this.roles.setBaseUrl(url);
    this.groups.setBaseUrl(url);
    this.permissions.setBaseUrl(url);
    this.adMappings.setBaseUrl(url);
  }

  setTimeout(timeout: number): void {
    super.setTimeout(timeout);
    this.ideas.setTimeout(timeout);
    this.auth.setTimeout(timeout);
    this.catalog.setTimeout(timeout);
    this.assessments.setTimeout(timeout);
    this.documentTemplates.setTimeout(timeout);
    this.documents.setTimeout(timeout);
    this.ideaInsights.setTimeout(timeout);
    this.users.setTimeout(timeout);
    this.roles.setTimeout(timeout);
    this.groups.setTimeout(timeout);
    this.permissions.setTimeout(timeout);
    this.adMappings.setTimeout(timeout);
  }
}

export const apiService = new ApiService();

export {
  IdeasApiService,
  AuthApiService,
  IdeaCatalogApiService,
  IdeaAssessmentsApiService,
  UsersApiService,
  RolesApiService,
  GroupsApiService,
  PermissionsApiService,
  AdMappingsApiService,
};

export { BaseApiService };
