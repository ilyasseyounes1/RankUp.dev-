export const RANKS = [
  { label: "Initiate",       badge: "E", min: 0,    color: "#6B7280" },
  { label: "Junior Dev",     badge: "D", min: 0.08, color: "#10B981" },
  { label: "Intermediate",   badge: "C", min: 0.22, color: "#38BDF8" },
  { label: "Advanced",       badge: "B", min: 0.42, color: "#8B5CF6" },
  { label: "Senior",         badge: "A", min: 0.68, color: "#F59E0B" },
  { label: "Elite Engineer", badge: "S", min: 0.88, color: "#EF4444" },
];

export function getRank(pct) {
  for (let i = RANKS.length - 1; i >= 0; i--)
    if (pct >= RANKS[i].min) return RANKS[i];
  return RANKS[0];
}

export const DATA = [
  {
    id: 1, title: "FOUNDATIONS", subtitle: "Core Java & Programming Fundamentals",
    duration: "6–8 weeks", color: "#FF6B35", icon: "⚙️",
    tracks: [
      { name: "Java Core", topics: [
        { name: "OOP Principles", detail: "Classes, objects, inheritance, polymorphism, encapsulation, abstraction",
          checklist: ["Understand the 4 pillars: encapsulation, abstraction, inheritance, polymorphism","Create classes with private fields and public getters/setters","Implement inheritance with 'extends' and method overriding","Use abstract classes and interfaces correctly","Understand when to use composition over inheritance","Implement polymorphism with method overloading and overriding","Build a small project using all 4 OOP pillars (e.g. Animal hierarchy)"],
          resources: [{ label: "Java OOP – Bro Code (YouTube)", url: "https://www.youtube.com/watch?v=PFmuCDHHpwk" },{ label: "OOP in Java – Codecademy", url: "https://www.codecademy.com/learn/learn-java" },{ label: "Java OOP – W3Schools (reference)", url: "https://www.w3schools.com/java/java_oop.asp" }]
        },
        { name: "Java Collections", detail: "List, Set, Map, Queue, Stack — when and why to use each",
          checklist: ["Use ArrayList and LinkedList, know the difference in performance","Use HashSet, LinkedHashSet, TreeSet correctly","Use HashMap, LinkedHashMap, TreeMap — explain time complexity","Iterate collections with for-each, Iterator, and Stream","Choose the right collection for a given problem","Understand generics syntax: List<String>, Map<K,V>","Use Collections utility class (sort, shuffle, unmodifiable)"],
          resources: [{ label: "Java Collections – Amigoscode (YouTube)", url: "https://www.youtube.com/watch?v=GdAon80-0KA" },{ label: "Collections Framework – Oracle Docs", url: "https://docs.oracle.com/javase/tutorial/collections/intro/index.html" }]
        },
        { name: "Generics & Lambdas", detail: "Type safety, functional interfaces, method references",
          checklist: ["Write generic classes and methods with type parameters","Understand bounded wildcards: <? extends T>, <? super T>","Write lambda expressions for functional interfaces","Use built-in functional interfaces: Predicate, Function, Consumer, Supplier","Use method references (Class::method, instance::method)","Understand type erasure at compile time","Replace anonymous inner classes with lambdas"],
          resources: [{ label: "Java Lambdas & Streams – Amigoscode", url: "https://www.youtube.com/watch?v=tc3F9LbVFuQ" },{ label: "Lambdas in Java – Baeldung", url: "https://www.baeldung.com/java-8-lambda-expressions-tips" }]
        },
        { name: "Streams API", detail: "filter, map, reduce, collect, Optional — functional pipelines",
          checklist: ["Create streams from collections, arrays, and Stream.of()","Use filter(), map(), flatMap() correctly","Use reduce() to aggregate data","Collect results: toList(), toSet(), toMap(), groupingBy()","Use Optional to avoid NullPointerException","Chain multiple stream operations in a pipeline","Understand lazy evaluation and when streams execute","Use parallel streams appropriately"],
          resources: [{ label: "Java Streams API – Amigoscode", url: "https://www.youtube.com/watch?v=Q93lQ84v7Ok" },{ label: "Streams Guide – Baeldung", url: "https://www.baeldung.com/java-8-streams" }]
        },
        { name: "Exception Handling", detail: "Checked vs unchecked, custom exceptions, try-with-resources",
          checklist: ["Distinguish checked vs unchecked exceptions","Use try-catch-finally properly","Create custom exception classes","Use try-with-resources for AutoCloseable","Chain exceptions with initCause / constructor","Know when NOT to catch exceptions","Handle multiple exceptions in one catch block"],
          resources: [{ label: "Java Exception Handling – Bro Code", url: "https://www.youtube.com/watch?v=1XAfapkBQjk" },{ label: "Exceptions – Oracle Tutorial", url: "https://docs.oracle.com/javase/tutorial/essential/exceptions/" }]
        },
        { name: "Concurrency", detail: "Threads, ExecutorService, CompletableFuture, synchronized",
          checklist: ["Create and start threads using Thread and Runnable","Use ExecutorService and thread pools","Understand synchronized keyword and monitor locks","Use volatile keyword correctly","Use CompletableFuture for async tasks","Understand race conditions and deadlocks","Use concurrent collections: ConcurrentHashMap"],
          resources: [{ label: "Java Multithreading – Telusko", url: "https://www.youtube.com/watch?v=TCd8QIS-2KI" },{ label: "CompletableFuture Guide – Baeldung", url: "https://www.baeldung.com/java-completablefuture" }]
        },
        { name: "JVM Internals", detail: "Memory model, garbage collection, class loading basics",
          checklist: ["Understand Heap vs Stack memory","Explain Young Gen, Old Gen, Metaspace","Know how garbage collection works (GC roots, mark & sweep)","Understand class loading (Bootstrap, Extension, Application)","Read basic JVM flags: -Xms, -Xmx, -Xss","Use jvisualvm or jconsole to monitor memory"],
          resources: [{ label: "JVM Architecture – Java Brains", url: "https://www.youtube.com/watch?v=ZBJ0u9MaKtM" },{ label: "JVM Internals – Baeldung", url: "https://www.baeldung.com/jvm-garbage-collectors" }]
        }
      ]},
      { name: "Tools & Ecosystem", topics: [
        { name: "Git & GitHub", detail: "Branching, merging, rebasing, pull requests, workflows",
          checklist: ["Init a repo, stage and commit files","Create and switch branches","Merge branches and resolve conflicts","Rebase vs merge — know when to use each","Push to GitHub, open pull requests","Use .gitignore correctly","Understand Git flow or trunk-based development"],
          resources: [{ label: "Git & GitHub Crash Course – Traversy", url: "https://www.youtube.com/watch?v=SWYqp7iY_Tc" },{ label: "Learn Git Branching (Interactive)", url: "https://learngitbranching.js.org/" }]
        },
        { name: "Maven / Gradle", detail: "Build lifecycle, dependency management, plugins",
          checklist: ["Understand Maven project structure (pom.xml)","Add and manage dependencies in pom.xml","Run Maven lifecycle phases: clean, compile, test, package","Understand Gradle basics as alternative (build.gradle)","Create and run a basic Spring Boot app with Maven","Use Maven wrapper (mvnw)"],
          resources: [{ label: "Maven Crash Course – Amigoscode", url: "https://www.youtube.com/watch?v=Xatr8AZLOsE" },{ label: "Official Maven Docs", url: "https://maven.apache.org/guides/getting-started/" }]
        },
        { name: "Docker Basics", detail: "Images, containers, Dockerfile, docker-compose",
          checklist: ["Install Docker and run your first container","Pull images from Docker Hub","Write a basic Dockerfile for a Java app","Build and tag Docker images","Use docker-compose to run multi-container apps","Map ports and volumes in docker-compose.yml","Use Docker to run PostgreSQL locally"],
          resources: [{ label: "Docker Tutorial – TechWorld with Nana", url: "https://www.youtube.com/watch?v=3c-iBn73dDE" },{ label: "Play with Docker (browser sandbox)", url: "https://labs.play-with-docker.com/" }]
        }
      ]}
    ],
    project: "CLI Task Manager with file persistence, custom exceptions, multi-threading auto-save"
  },
  {
    id: 2, title: "DESIGN PATTERNS", subtitle: "Writing Code That Lasts",
    duration: "3–4 weeks", color: "#8B5CF6", icon: "🔷",
    tracks: [
      { name: "Creational Patterns", topics: [
        { name: "Singleton", detail: "Lazy vs eager init, thread-safe Singleton",
          checklist: ["Implement eager initialization Singleton","Implement lazy initialization Singleton","Make Singleton thread-safe with synchronized or double-checked locking","Use enum-based Singleton (Joshua Bloch's approach)","Identify real-world Singleton use cases (config manager, logger)","Explain why Singleton is sometimes considered an anti-pattern"],
          resources: [{ label: "Singleton Pattern – Refactoring.Guru", url: "https://refactoring.guru/design-patterns/singleton" },{ label: "Design Patterns in Java – Derek Banas", url: "https://www.youtube.com/watch?v=vNHpsC5ng_E" }]
        },
        { name: "Factory & Builder", detail: "Decoupling object creation, fluent APIs",
          checklist: ["Implement Factory Method pattern","Implement Abstract Factory for families of objects","Build a Builder pattern with fluent API (method chaining)","Use Builder for complex object construction (config objects)","Recognize Spring's use of Builder pattern (@Builder in Lombok)","Implement Prototype pattern with clone()"],
          resources: [{ label: "Factory Pattern – Refactoring.Guru", url: "https://refactoring.guru/design-patterns/factory-method" },{ label: "Builder Pattern – Refactoring.Guru", url: "https://refactoring.guru/design-patterns/builder" }]
        }
      ]},
      { name: "Structural Patterns", topics: [
        { name: "Adapter & Decorator", detail: "Interface bridging and dynamic behavior addition",
          checklist: ["Implement Adapter to make incompatible interfaces work together","Identify real use cases: legacy code integration","Implement Decorator to add behavior without subclassing","Stack multiple decorators on one object","Recognize Java I/O streams as Decorator pattern","Distinguish Decorator from inheritance"],
          resources: [{ label: "Adapter Pattern – Refactoring.Guru", url: "https://refactoring.guru/design-patterns/adapter" },{ label: "Decorator Pattern – Refactoring.Guru", url: "https://refactoring.guru/design-patterns/decorator" }]
        },
        { name: "Proxy & Facade", detail: "Access control and interface simplification",
          checklist: ["Implement a virtual proxy for lazy loading","Implement a protection proxy for access control","Explain how Spring AOP uses Proxy pattern under the hood","Implement Facade to simplify a complex subsystem","Identify Facade in Spring (JdbcTemplate, RestTemplate)","Know difference: Adapter vs Facade vs Proxy"],
          resources: [{ label: "Proxy Pattern – Refactoring.Guru", url: "https://refactoring.guru/design-patterns/proxy" },{ label: "Facade Pattern – Refactoring.Guru", url: "https://refactoring.guru/design-patterns/facade" }]
        }
      ]},
      { name: "Behavioral Patterns", topics: [
        { name: "Strategy & Observer", detail: "Interchangeable algorithms and event-driven systems",
          checklist: ["Implement Strategy pattern with interface and multiple implementations","Replace switch/if-else chains with Strategy","Build a real example: payment methods (Card, PayPal, Crypto)","Implement Observer with subject and multiple listeners","Use Java's built-in Observer or Spring Events","Build real example: order status change notifies email + SMS"],
          resources: [{ label: "Strategy Pattern – Refactoring.Guru", url: "https://refactoring.guru/design-patterns/strategy" },{ label: "Observer Pattern – Refactoring.Guru", url: "https://refactoring.guru/design-patterns/observer" }]
        }
      ]},
      { name: "Architecture Principles", topics: [
        { name: "SOLID Principles", detail: "The 5 laws of maintainable object-oriented design",
          checklist: ["S: Apply Single Responsibility — one class, one reason to change","O: Apply Open/Closed — extend without modifying existing code","L: Apply Liskov Substitution — subclasses must honor parent contract","I: Apply Interface Segregation — small focused interfaces","D: Apply Dependency Inversion — depend on abstractions not concretions","Refactor a badly written class to follow all 5 principles","Identify SOLID violations in code review"],
          resources: [{ label: "SOLID Principles – Amigoscode", url: "https://www.youtube.com/watch?v=_jDNAkmL-4" },{ label: "SOLID in Java – Baeldung", url: "https://www.baeldung.com/solid-principles" }]
        },
        { name: "Repository & Service Layer", detail: "Clean architecture layering for business apps",
          checklist: ["Implement Repository pattern to abstract data access","Create a Service layer for all business logic","Keep Controllers thin (only HTTP handling)","Use DTO pattern — never expose JPA entities in API responses","Map entities to DTOs (manual or MapStruct)","Understand package structure: controller/service/repository/model/dto"],
          resources: [{ label: "Spring Boot Architecture – Amigoscode", url: "https://www.youtube.com/watch?v=9SGDpanrc8U" },{ label: "DTO Pattern – Baeldung", url: "https://www.baeldung.com/java-dto-pattern" }]
        }
      ]}
    ],
    project: "Refactor CLI Task Manager with Strategy (sorting), Observer (notifications), Builder (task creation), Repository pattern"
  },
  {
    id: 3, title: "SPRING BOOT", subtitle: "Backend Mastery",
    duration: "8–10 weeks", color: "#10B981", icon: "🍃",
    tracks: [
      { name: "Spring Core", topics: [
        { name: "IoC & Dependency Injection", detail: "@Autowired, @Component, @Bean, @Configuration",
          checklist: ["Explain Inversion of Control (IoC) in your own words","Use @Component, @Service, @Repository, @Controller correctly","Inject dependencies with @Autowired (constructor injection preferred)","Define beans with @Bean inside @Configuration classes","Use @Primary and @Qualifier to resolve ambiguity","Understand bean lifecycle: init and destroy methods","Use @Scope to change bean scope (singleton/prototype)"],
          resources: [{ label: "Spring Boot Full Course – Amigoscode", url: "https://www.youtube.com/watch?v=9SGDpanrc8U" },{ label: "Spring IoC – Baeldung", url: "https://www.baeldung.com/inversion-control-and-dependency-injection-in-spring" }]
        },
        { name: "Spring AOP", detail: "Aspects, advice types, pointcuts, cross-cutting concerns",
          checklist: ["Explain AOP concepts: Aspect, Advice, Pointcut, JoinPoint","Write @Before, @After, @Around advice","Define pointcut expressions to target methods","Build a logging aspect for all service methods","Build a performance monitoring aspect","Understand that Spring AOP uses Proxy pattern internally","Know limitation: AOP doesn't work on internal method calls"],
          resources: [{ label: "Spring AOP – Baeldung", url: "https://www.baeldung.com/spring-aop" },{ label: "Spring AOP Tutorial – Java Brains", url: "https://www.youtube.com/watch?v=QdyLsX0nG30" }]
        }
      ]},
      { name: "REST APIs", topics: [
        { name: "Controllers & REST Design", detail: "REST conventions, HTTP methods, status codes",
          checklist: ["Use @RestController, @RequestMapping, @GetMapping etc.","Extract path variables with @PathVariable","Read request body with @RequestBody","Read query params with @RequestParam","Return correct HTTP status codes (200, 201, 400, 404, 500)","Use ResponseEntity to control response headers and status","Design RESTful URIs (nouns, not verbs, plural resources)","Implement pagination and sorting with Pageable"],
          resources: [{ label: "REST API with Spring Boot – Amigoscode", url: "https://www.youtube.com/watch?v=9SGDpanrc8U" },{ label: "Building REST Services – Spring.io Guide", url: "https://spring.io/guides/tutorials/rest/" }]
        },
        { name: "Validation & Exception Handling", detail: "@Valid, @ControllerAdvice, custom errors",
          checklist: ["Use @Valid with @RequestBody for input validation","Apply @NotNull, @NotBlank, @Size, @Email, @Min, @Max","Create custom validator annotations","Use @ControllerAdvice for global exception handling","Use @ExceptionHandler for specific exceptions","Return consistent error response structure (RFC 7807)","Handle validation errors and return field-level messages"],
          resources: [{ label: "Spring Validation – Baeldung", url: "https://www.baeldung.com/spring-boot-bean-validation" },{ label: "Exception Handling in Spring – Baeldung", url: "https://www.baeldung.com/exception-handling-for-rest-with-spring" }]
        },
        { name: "OpenAPI / Swagger", detail: "Document your API professionally",
          checklist: ["Add springdoc-openapi dependency","Access Swagger UI at /swagger-ui.html","Annotate endpoints with @Operation and @ApiResponse","Document request/response models with @Schema","Group endpoints with tags","Configure Swagger for JWT auth header"],
          resources: [{ label: "SpringDoc OpenAPI – Official Docs", url: "https://springdoc.org/" },{ label: "Swagger with Spring Boot – Baeldung", url: "https://www.baeldung.com/spring-rest-openapi-documentation" }]
        }
      ]},
      { name: "Spring Data JPA", topics: [
        { name: "JPA & Hibernate Fundamentals", detail: "Entities, relationships, fetch types, cascading",
          checklist: ["Annotate entities with @Entity, @Id, @GeneratedValue","Map OneToOne, OneToMany, ManyToMany relationships","Understand EAGER vs LAZY fetching — always default to LAZY","Configure cascading: CascadeType.ALL vs selective","Use @Column to configure constraints","Understand bidirectional vs unidirectional relationships","Use @Embedded and @Embeddable for value objects"],
          resources: [{ label: "Hibernate & JPA – Thorben Janssen", url: "https://www.youtube.com/watch?v=3y-JMEE7P2g" },{ label: "JPA Relationships – Baeldung", url: "https://www.baeldung.com/jpa-hibernate-associations" }]
        },
        { name: "Spring Data Repositories", detail: "JpaRepository, custom queries, Specifications",
          checklist: ["Extend JpaRepository and use built-in CRUD methods","Write derived query methods: findByNameAndEmail()","Write @Query with JPQL","Write @Query with native SQL","Use Pageable for paginated queries","Implement JPA Specifications for dynamic filtering","Use @Modifying with @Query for updates/deletes"],
          resources: [{ label: "Spring Data JPA – Amigoscode", url: "https://www.youtube.com/watch?v=8SGI_XS5OPw" },{ label: "Spring Data JPA Docs", url: "https://docs.spring.io/spring-data/jpa/docs/current/reference/html/" }]
        },
        { name: "Transactions & N+1 Problem", detail: "Data integrity and query optimization",
          checklist: ["Use @Transactional correctly (service layer, not repository)","Understand propagation types: REQUIRED, REQUIRES_NEW","Understand isolation levels (READ_COMMITTED etc.)","Identify the N+1 query problem with logging","Fix N+1 with JOIN FETCH in JPQL","Fix N+1 with @EntityGraph","Use Flyway or Liquibase for database migrations"],
          resources: [{ label: "Spring Transactions – Baeldung", url: "https://www.baeldung.com/transaction-configuration-with-jpa-and-spring" },{ label: "N+1 Problem Explained – Vlad Mihalcea", url: "https://vladmihalcea.com/n-plus-1-query-problem/" }]
        }
      ]},
      { name: "Spring Security", topics: [
        { name: "JWT Authentication", detail: "Full JWT flow: login, token, validate, refresh",
          checklist: ["Configure SecurityFilterChain (lambda DSL)","Implement UserDetailsService with database users","Generate JWT tokens on login","Validate JWT tokens in a filter (OncePerRequestFilter)","Store JWT in HttpOnly cookie OR Authorization header","Implement refresh token flow","Disable CSRF for stateless REST APIs","Configure CORS for frontend integration"],
          resources: [{ label: "Spring Security JWT – Amigoscode", url: "https://www.youtube.com/watch?v=KxqlJblhzfI" },{ label: "JWT with Spring Boot – Baeldung", url: "https://www.baeldung.com/spring-security-oauth-jwt" }]
        },
        { name: "Authorization & Roles", detail: "Role-based and method-level access control",
          checklist: ["Define roles and permissions in database","Use hasRole() and hasAuthority() in SecurityFilterChain","Apply @PreAuthorize on service methods","Use @PostAuthorize for post-execution checks","Secure endpoints by role (ADMIN, USER, MODERATOR)","Test security rules with MockMvc"],
          resources: [{ label: "Spring Security Authorization – Baeldung", url: "https://www.baeldung.com/spring-security-method-security" }]
        }
      ]},
      { name: "Advanced Spring", topics: [
        { name: "Redis Caching", detail: "@Cacheable, Redis integration, session store",
          checklist: ["Add Redis to docker-compose","Configure Spring Cache with Redis","Use @Cacheable on service methods","Use @CacheEvict to invalidate cache","Use @CachePut to update cache on write","Store user sessions in Redis","Implement rate limiting with Redis counters"],
          resources: [{ label: "Spring Boot Redis Cache – Amigoscode", url: "https://www.youtube.com/watch?v=dAL1C7-_7K4" },{ label: "Spring Cache – Baeldung", url: "https://www.baeldung.com/spring-cache-tutorial" }]
        },
        { name: "Testing", detail: "@SpringBootTest, MockMvc, @DataJpaTest",
          checklist: ["Write unit tests for service layer with Mockito","Write integration tests with @SpringBootTest","Test REST endpoints with MockMvc","Use @DataJpaTest for repository tests","Use TestContainers for real database in tests","Aim for 70%+ code coverage on services","Use @MockBean to mock dependencies in Spring context"],
          resources: [{ label: "Spring Boot Testing – Amigoscode", url: "https://www.youtube.com/watch?v=jqwZthuBmZY" },{ label: "Testing in Spring – Baeldung", url: "https://www.baeldung.com/spring-boot-testing" }]
        }
      ]}
    ],
    project: "Full E-commerce REST API: JWT auth, products, orders, Redis cache, Flyway migrations, 70%+ test coverage"
  },
  {
    id: 4, title: "REACT FRONTEND", subtitle: "Modern UI Development",
    duration: "7–9 weeks", color: "#38BDF8", icon: "⚛️",
    tracks: [
      { name: "JavaScript & TypeScript", topics: [
        { name: "ES6+ Fundamentals", detail: "Destructuring, spread/rest, optional chaining, modules",
          checklist: ["Use let/const correctly, understand block scope","Destructure arrays and objects (including nested)","Use spread operator for arrays and objects","Use rest parameters in functions","Use optional chaining (?.) and nullish coalescing (??)","Write and import ES modules (import/export)","Use template literals for string interpolation"],
          resources: [{ label: "JavaScript ES6 – freeCodeCamp", url: "https://www.youtube.com/watch?v=nZ1DMMsyVyI" },{ label: "The Modern JavaScript Tutorial", url: "https://javascript.info/" }]
        },
        { name: "Async JavaScript", detail: "Promises, async/await, error handling",
          checklist: ["Understand the event loop and call stack","Create and chain Promises","Use async/await to write async code synchronously","Handle errors with try/catch in async functions","Use Promise.all() for parallel requests","Use Promise.allSettled() when you need all results","Fetch data from an API with fetch() and async/await"],
          resources: [{ label: "JavaScript Async – The Net Ninja", url: "https://www.youtube.com/watch?v=ZYb_ZU8LNxs" },{ label: "Async/Await – javascript.info", url: "https://javascript.info/async-await" }]
        },
        { name: "TypeScript Basics", detail: "Types, interfaces, generics, union types",
          checklist: ["Add types to variables, function params and return values","Define interfaces and type aliases","Use union types (string | number) and optional properties","Write generic functions and interfaces","Use type guards (typeof, instanceof)","Configure tsconfig.json for a React project","Type API responses with interfaces"],
          resources: [{ label: "TypeScript Crash Course – Traversy", url: "https://www.youtube.com/watch?v=BCg4U1FzODs" },{ label: "TypeScript Official Docs", url: "https://www.typescriptlang.org/docs/handbook/intro.html" }]
        }
      ]},
      { name: "React Core", topics: [
        { name: "Components & Props", detail: "Functional components, JSX, composition",
          checklist: ["Create functional components and render JSX","Pass props and use them inside components","Use children prop for composable components","Render lists with .map() and add key prop","Conditionally render with ternary and &&","Understand component composition vs inheritance","Use React.Fragment to avoid unnecessary divs"],
          resources: [{ label: "React Full Course – Dave Gray", url: "https://www.youtube.com/watch?v=RVFAyFWO4go" },{ label: "React Official Docs", url: "https://react.dev/learn" }]
        },
        { name: "Hooks: useState & useEffect", detail: "State and side effects management",
          checklist: ["Use useState to manage local component state","Update state correctly (functional updates for derived state)","Use useEffect for side effects (API calls, subscriptions)","Understand dependency array: [], [dep], no array","Return cleanup function from useEffect","Avoid infinite loops in useEffect","Fetch API data with useEffect and handle loading/error states"],
          resources: [{ label: "React Hooks – Web Dev Simplified", url: "https://www.youtube.com/watch?v=O6P86uwfdR0" },{ label: "useEffect Explained – react.dev", url: "https://react.dev/learn/synchronizing-with-effects" }]
        },
        { name: "Advanced Hooks", detail: "useRef, useMemo, useCallback, custom hooks",
          checklist: ["Use useRef to access DOM elements","Use useRef to persist values without re-render","Use useMemo to memoize expensive computations","Use useCallback to memoize event handlers","Know when NOT to use useMemo/useCallback (premature optimization)","Extract reusable logic into custom hooks","Build: useFetch, useDebounce, useLocalStorage custom hooks"],
          resources: [{ label: "Advanced React Hooks – Web Dev Simplified", url: "https://www.youtube.com/watch?v=_AyFP5s69N4" },{ label: "Custom Hooks – react.dev", url: "https://react.dev/learn/reusing-logic-with-custom-hooks" }]
        }
      ]},
      { name: "State Management", topics: [
        { name: "Redux Toolkit", detail: "createSlice, createAsyncThunk, RTK Query",
          checklist: ["Set up Redux store with configureStore","Create slices with createSlice (state + reducers)","Dispatch actions and read state with useSelector/useDispatch","Handle async operations with createAsyncThunk","Use RTK Query for data fetching and caching","Handle loading, error, success states in slices","Use Redux DevTools to debug state"],
          resources: [{ label: "Redux Toolkit – Dave Gray", url: "https://www.youtube.com/watch?v=NqzdVN2tyvQ" },{ label: "Redux Toolkit Official Docs", url: "https://redux-toolkit.js.org/" }]
        },
        { name: "React Query (TanStack)", detail: "Server state, caching, mutations",
          checklist: ["Fetch data with useQuery hook","Handle loading, error, success states","Use useMutation for POST/PUT/DELETE operations","Invalidate and refetch queries after mutations","Configure staleTime and cacheTime","Use query keys effectively for cache management","Understand why React Query often replaces Redux for server state"],
          resources: [{ label: "React Query Tutorial – The Net Ninja", url: "https://www.youtube.com/watch?v=novnyCaa7To" },{ label: "TanStack Query Docs", url: "https://tanstack.com/query/latest" }]
        }
      ]},
      { name: "Routing & Forms", topics: [
        { name: "React Router v6", detail: "Nested routes, protected routes, params",
          checklist: ["Set up BrowserRouter with Routes and Route","Navigate with Link, NavLink, useNavigate","Use useParams for dynamic route parameters","Use useSearchParams for query strings","Implement nested routes with Outlet","Build protected routes with auth redirect","Use loader and errorElement for data routing"],
          resources: [{ label: "React Router v6 – Web Dev Simplified", url: "https://www.youtube.com/watch?v=Ul3y1LXxzdU" },{ label: "React Router Official Docs", url: "https://reactrouter.com/en/main" }]
        },
        { name: "React Hook Form + Validation", detail: "Performant forms with schema validation",
          checklist: ["Register inputs with useForm register()","Handle form submission with handleSubmit","Display field-level error messages","Use watch() and setValue() for reactive forms","Validate with schema-based validation (Zod or Yup)","Handle async form submission with loading state","Build reusable form field components"],
          resources: [{ label: "React Hook Form – Web Dev Simplified", url: "https://www.youtube.com/watch?v=cc_xmawJ8Kg" },{ label: "React Hook Form Docs", url: "https://react-hook-form.com/get-started" }]
        }
      ]},
      { name: "Styling", topics: [
        { name: "Tailwind CSS", detail: "Utility-first styling, responsive design",
          checklist: ["Set up Tailwind in a React project","Use spacing, color, typography utility classes","Apply responsive prefixes: sm:, md:, lg:, xl:","Use Flexbox and Grid utilities","Apply hover:, focus:, active: state variants","Extract repeated patterns with @apply in CSS","Use shadcn/ui components built on Tailwind + Radix"],
          resources: [{ label: "Tailwind CSS Crash Course – Traversy", url: "https://www.youtube.com/watch?v=UBOj6rqRUME" },{ label: "Tailwind Docs", url: "https://tailwindcss.com/docs" }]
        }
      ]}
    ],
    project: "E-commerce frontend: product catalog, cart, auth (JWT), order history, real-time notifications"
  },
  {
    id: 5, title: "FULL STACK INTEGRATION", subtitle: "Connecting All the Pieces",
    duration: "4–5 weeks", color: "#F59E0B", icon: "🔗",
    tracks: [
      { name: "API Integration", topics: [
        { name: "Axios & Auth Flow", detail: "Interceptors, JWT headers, error handling",
          checklist: ["Set up Axios instance with base URL","Add JWT token to Authorization header automatically with interceptors","Handle 401 errors and trigger refresh token flow","Implement global error handling interceptor","Handle network errors gracefully in UI","Use environment variables for API base URL (.env)","Test API integration end-to-end with backend running"],
          resources: [{ label: "Axios Crash Course – Traversy", url: "https://www.youtube.com/watch?v=6LyagkoRWYA" },{ label: "JWT Auth React + Spring – Amigoscode", url: "https://www.youtube.com/watch?v=KxqlJblhzfI" }]
        }
      ]},
      { name: "DevOps & Deployment", topics: [
        { name: "Docker Compose Full Stack", detail: "Spring Boot + React + PostgreSQL + Redis in containers",
          checklist: ["Write Dockerfile for Spring Boot app","Write Dockerfile for React app (multi-stage build)","Compose all services: backend, frontend, db, redis","Use environment variables in docker-compose","Set up Nginx to serve React and proxy API","Use docker-compose for local dev environment","Push images to Docker Hub"],
          resources: [{ label: "Docker Compose Full Stack – TechWorld with Nana", url: "https://www.youtube.com/watch?v=DM65_JyGxCo" },{ label: "Dockerize Spring Boot – Baeldung", url: "https://www.baeldung.com/dockerizing-spring-boot-application" }]
        },
        { name: "CI/CD with GitHub Actions", detail: "Automated test, build, and deploy pipelines",
          checklist: ["Create a .github/workflows/ci.yml pipeline","Run tests automatically on every push","Build Docker image in CI pipeline","Deploy to cloud (Render/Railway/AWS) on merge to main","Add environment secrets in GitHub Actions","Add build status badge to README","Set up branch protection rules"],
          resources: [{ label: "GitHub Actions CI/CD – TechWorld with Nana", url: "https://www.youtube.com/watch?v=R8_veQiYBjI" },{ label: "GitHub Actions Docs", url: "https://docs.github.com/en/actions" }]
        }
      ]}
    ],
    project: "Deploy full-stack e-commerce end-to-end: Dockerized, CI/CD pipeline, HTTPS, live URL"
  },
  {
    id: 6, title: "JOB READY", subtitle: "Interview Prep & Portfolio",
    duration: "4–6 weeks", color: "#EF4444", icon: "🚀",
    tracks: [
      { name: "Algorithms & DSA", topics: [
        { name: "Core LeetCode Patterns", detail: "The 75 patterns that cover 90% of interview questions",
          checklist: ["Two pointers: pair sum, container with most water","Sliding window: max subarray, longest substring","HashMap: two sum, group anagrams, top K frequent","Binary search: search rotated array, find minimum","BFS/DFS: number of islands, clone graph, word ladder","Dynamic programming: climbing stairs, coin change, house robber","Trees: inorder traversal, LCA, validate BST","Solve 75 Blind LeetCode questions (all in Java)"],
          resources: [{ label: "Blind 75 LeetCode List", url: "https://leetcode.com/discuss/general-discussion/460599" },{ label: "NeetCode 150 – NeetCode.io", url: "https://neetcode.io/practice" }]
        }
      ]},
      { name: "System Design", topics: [
        { name: "System Design Fundamentals", detail: "Scalability, databases, caching, microservices",
          checklist: ["Explain horizontal vs vertical scaling","Design a URL shortener (Bitly clone)","Design a simple chat application","Explain CAP theorem in practical terms","Design for high availability and fault tolerance","Understand load balancers, CDN, message queues","Draw architecture diagrams for a full-stack app"],
          resources: [{ label: "System Design Interview – Gaurav Sen", url: "https://www.youtube.com/watch?v=xpDnVSmNFX0" },{ label: "System Design Primer (GitHub)", url: "https://github.com/donnemartin/system-design-primer" }]
        }
      ]},
      { name: "Portfolio & Career", topics: [
        { name: "Portfolio Projects & GitHub", detail: "3 polished projects that get you hired",
          checklist: ["Project 1: Full-stack app with auth, deployed, live demo","Project 2: Spring Boot API with full docs (Swagger) + tests","Project 3: React app with real-time feature (WebSocket or SSE)","Each repo has a detailed README with screenshots","Each project has a live deployed URL","GitHub profile has bio, avatar, pinned repos","Contribution graph shows consistent daily activity"],
          resources: [{ label: "How to Build a Dev Portfolio – Traversy", url: "https://www.youtube.com/watch?v=nrWGr2OvBD4" },{ label: "GitHub Profile README Guide", url: "https://github.com/abhisheknaiidu/awesome-github-profile-readme" }]
        },
        { name: "Interview Preparation", detail: "Technical + behavioral + salary negotiation",
          checklist: ["Prepare 10 STAR format behavioral stories","Practice explaining your projects in 2 minutes each","Do 5+ mock interviews on Pramp or Interviewing.io","Review Spring Boot common interview questions","Review React common interview questions","Practice salary negotiation (never give first number)","Research companies: culture, tech stack, salary ranges"],
          resources: [{ label: "Spring Boot Interview Q&A – Java Guides", url: "https://www.youtube.com/watch?v=2VkqTFyHDRM" },{ label: "Pramp – Free Mock Interviews", url: "https://www.pramp.com/" },{ label: "Levels.fyi – Salary Data", url: "https://www.levels.fyi/" }]
        }
      ]}
    ],
    project: "3 polished portfolio projects + updated LinkedIn + 10 job applications with tailored cover letters"
  }
];

export const TOTAL_TASKS = DATA.reduce((s, ph) =>
  s + ph.tracks.reduce((ss, tr) =>
    ss + tr.topics.reduce((sss, tp) => sss + tp.checklist.length, 0), 0), 0);
