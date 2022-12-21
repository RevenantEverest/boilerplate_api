import { 
    Entity, 
    BaseEntity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn
} from 'typeorm';

@Entity('users')
class User extends BaseEntity {

    constructor(
        id: number,
        email: string,
        created_at: Date
    ) {
        super();
        this.id = id;
        this.email = email;
        this.created_at = created_at;
    };

    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column({ type: "varchar", length: 255 })
    email: string;

    @CreateDateColumn()
    created_at: Date;
};

export default User;