import { User } from './user';
import bcrypt from 'bcrypt';
import assert from 'assert';



export default class Account {
    // This interface is required by oidc-provider
    static async findAccount(ctx: any, id: any) {
      // This would ideally be just a check whether the account is still in your storage
      const account = await User.findOne({ id });
      if (!account) {
        return undefined;
      }
      
      console.log(account)
      return {
        accountId: id,
        // and this claims() method would actually query to retrieve the account claims
        async claims() {
          return {
            sub: id,
            email: account.email,
            email_verified: account.email_verified,
          };
        },
      };
    }
  
    // This can be anything you need to authenticate a user
    static async authenticate(email:string, password:string) {
      try {
        assert(password, 'password must be provided');
        assert(email, 'email must be provided');
        const lowercased = String(email).toLowerCase();
        const account = await User.findOne({ email: lowercased });
        console.log('account', account);
        if(account && await bcrypt.compare(password, account.password)){

            return account._id;
        }else{

            assert(account, 'invalid credentials provided');
        }
  
      } catch (err) {
        return undefined;
      }
    }
  }
  

  