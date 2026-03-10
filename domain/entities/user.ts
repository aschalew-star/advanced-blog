
export interface UserProps {
  id?: number;                  // Optional for new users (before save)
  name?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
  password?: string | null;     // Hashed password – never plain!
  createdAt: Date;
  updatedAt: Date;

  // Relations (references only – not full objects, to keep entity lightweight)
  // In DDD, relations are often loaded on-demand via repository
  // accountIds?: number[];     // optional – if needed for domain logic
  // postIds?: number[];        // optional
}

export class User {
  private props: UserProps;

  constructor(props: UserProps) {
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };

    this.validate(); // Enforce invariants
  }

  // Getters (immutable access)
  get id(): number | undefined {
    return this.props.id;
  }

  get name(): string | null | undefined {
    return this.props.name;
  }

  get email(): string | null | undefined {
    return this.props.email;
  }

  get emailVerified(): Date | null | undefined {
    return this.props.emailVerified;
  }

  get image(): string | null | undefined {
    return this.props.image;
  }

  get password(): string | null | undefined {
    return this.props.password;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // Domain business methods / invariants
  private validate(): void {
    if (this.props.email && !this.isValidEmail(this.props.email)) {
      throw new Error('Invalid email format');
    }
    if (this.props.password && this.props.password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }
    // Add more rules: name length, etc.
  }

  private isValidEmail(email: string): boolean {
    // Simple regex – in real apps use zod or validator lib in use-case layer
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Example domain method
  markEmailVerified(): void {
    if (!this.props.email) {
      throw new Error('Cannot verify email without email address');
    }
    this.props.emailVerified = new Date();
    this.props.updatedAt = new Date();
  }

  // Convert to plain object for persistence (used by repository)
  toJSON(): any {
    return {
      id: this.props.id,
      name: this.props.name,
      email: this.props.email,
      emailVerified: this.props.emailVerified,
      image: this.props.image,
      password: this.props.password,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }

  // Static factory for reconstruction from DB
  static fromJSON(data: any): User {
    return new User({
      id: data.id,
      name: data.name,
      email: data.email,
      emailVerified: data.emailVerified ? new Date(data.emailVerified) : null,
      image: data.image,
      password: data.password,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
  }
}