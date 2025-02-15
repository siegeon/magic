
/*
 * Magic Cloud, copyright Aista, Ltd. See the attached LICENSE file for details.
 */

// Angular and system imports.
import { Injectable } from '@angular/core';

// Application specific imports.
import { Count } from '../../../../models/count.model';
import { PublicKey } from '../models/public-key.model';
import { Affected } from '../../../../models/affected.model';
import { Response } from '../../../../models/response.model';
import { HttpService } from '../../../../services/http.service';
import { PublicKeyFull } from '../models/public-key-full.model';
import { CryptoInvocation } from '../models/crypto-invocations.model';
import { KeyPair } from '../models/key-pair.model';

/**
 * Crypto service, allows you to administrate your cryptography keys.
 */
@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  /**
   * Creates an instance of your service.
   * 
   * @param httpService HTTP service to use for backend invocations
   */
  constructor(private httpService: HttpService) { }

  /**
   * Retrieves the public key from server and returns to caller.
   */
  public serverPublicKey() {

    // Invoking backend and returning observable to caller.
    return this.httpService.get<PublicKeyFull>(
      '/magic/system/crypto/public-key');
  }

  /**
   * Returns public keys from your backend.
   * 
   * @param filter Filter for which keys to return
   */
  public publicKeys(filter: any) {

    // Dynamically building our query parameters.
    let query = '';
    if (filter !== null) {

      if (filter.key_id) {

        // Retrieve single key invocation.
        query += '?id.eq=' + encodeURIComponent(filter.key_id);

      } else {

        // Applying limit and offset
        query += '?limit=' + filter.limit;
        query += '&offset=' + filter.offset;
        query += '&order=imported';
        query += '&direction=desc';

        // Applying filter parts, if given.
        if (filter.filter && filter.filter !== '') {
          query += '&operator=or';
          query += '&email.like=' + encodeURIComponent('%' + filter.filter + '%');
          query += '&subject.like=' + encodeURIComponent('%' + filter.filter + '%');
          query += '&fingerprint.eq=' + encodeURIComponent(filter.filter);
        }
      }
    }

    // Invoking backend and returning observable.
    return this.httpService.get<PublicKey[]>('/magic/modules/magic/crypto_keys' + query);
  }

  /**
   * Returns public keys from your backend.
   * 
   * @param filter Filter for which keys to return
   */
  public countPublicKeys(filter: any) {

    // Dynamically building our query parameters.
    let query = '';
    if (filter !== null && filter.filter && filter.filter !== '') {
      query += '?operator=or';
      query += '&email.like=' + encodeURIComponent('%' + filter.filter + '%');
      query += '&subject.like=' + encodeURIComponent('%' + filter.filter + '%');
      query += '&fingerprint.eq=' + encodeURIComponent(filter.filter);
    }

    // Invoking backend and returning observable.
    return this.httpService.get<Count>('/magic/modules/magic/crypto_keys-count' + query);
  }

  /**
   * Deletes a public key from your backend.
   * 
   * @param id Unique ID of public key to delete
   */
  public deletePublicKey(id: number) {

    // Invoking backend and returning observable.
    return this.httpService.delete<Affected>('/magic/modules/magic/crypto_keys?id=' + id);
  }

  /**
   * Changes the enabled state of the specified key.
   * 
   * @param id Key caller wants to change enabled state of
   * @param enabled Whether or not caller wants to enable or disable key
   */
  public setEnabled(id: number, enabled: boolean) {
    return this.httpService.put<Affected>('/magic/modules/magic/crypto_keys', {
      id,
      enabled
    });
  }

  /**
   * Saves the public key declaration by invoking backend.
   * 
   * @param key Key caller wants to save
   */
  public updatePublicKey(key: PublicKey) {
    const payload: any = {
      id: key.id,
      subject: key.subject,
      email: key.email,
      fingerprint: key.fingerprint,
      content: key.content,
      vocabulary: key.vocabulary,
      enabled: key.enabled,
    };
    if (key.domain && key.domain !== '') {
      payload.domain = key.domain;
    } else {
      payload.domain = null;
    }
    return this.httpService.put<Affected>('/magic/modules/magic/crypto_keys', payload);
  }

  /**
   * Associates the specified public key with a user.
   * 
   * @param keyId Key caller wants to associate with user.
   * @param username Username caller wants to associate with key.
   */
   public associateWithUser(keyId: number, username: string) {
    return this.httpService.put<Response>('/magic/system/crypto/associate-user', {
      keyId,
      username
    });
  }

  /**
   * Returns the username of the user key is associated with, if any.
   * 
   * @param keyId Key caller wants to retrieve association for.
   */
   public getUserAssociation(keyId: number) {
    return this.httpService.get<Response>('/magic/system/crypto/user-association?keyId=' + keyId);
  }

  /**
   * Deletes any existing associations between a user and a public key.
   * 
   * @param keyId Key caller wants to associate with user.
   */
   public deleteUserAssociation(keyId: number) {
    return this.httpService.put<Response>('/magic/system/crypto/deassociate-user', {
      keyId,
    });
  }

  /**
   * Generates a cryptography key pair for your server.
   * 
   * @param strength Strength of key pair to generate, typically 2048, 4096, or some other exponent of 2
   * @param seed Used to seed the CSRNG object
   * @param subject Identity to use for key, typically owner's full name
   * @param email Email address of key's owner
   * @param domain URL to associate the key with, typically the backend's root URL
   */
   public generateKeyPair(
    strength: number,
    seed: string,
    subject: string,
    email: string,
    domain: string) {

    // Invoking backend and returning observable to caller.
    return this.httpService.post<KeyPair>('/magic/system/crypto/generate-keypair', {
      strength,
      seed,
      subject,
      email,
      domain
    });
  }

  /**
   * Imports a public key.
   * 
   * @param key Key caller wants to import
   */
  public createPublicKey(key: PublicKey) {
    return this.httpService.post<Response>('/magic/modules/magic/crypto_keys', {
      type: key.type,
      subject: key.subject,
      email: key.email,
      domain: key.domain,
      fingerprint: key.fingerprint,
      content: key.content,
      vocabulary: key.vocabulary,
      enabled: key.enabled,
    });
  }

  /**
   * Imports a public key into the system.
   * 
   * @param subject Name of key owner
   * @param email Email of owner
   * @param domain Root domain of key's owner
   * @param content Actual public key content
   */
  public importPublicKey(
    subject: string,
    email: string,
    domain: string,
    content: string) {
      return this.httpService.post<Response>('/magic/system/crypto/import', {
        subject,
        email,
        domain,
        content
      });
  }

  /**
   * Invokes server to find the fingerprint of a public key.
   * 
   * @param key Key to retrieve fingerprint for
   */
  public getFingerprint(key: string) {

    // Invoking backend and returning observable.
    return this.httpService.get<Response>(
      '/magic/system/crypto/get-fingerprint?key=' +
      encodeURIComponent(key));
  }

  /**
   * Returns cryptographically signed invocations from backend to caller.
   * 
   * @param filter Filter for filtering which invocations to return
   */
  public invocations(filter: any = null) {

    // Dynamically building our query parameters.
    let query = '';
    if (filter !== null) {

      // Applying limit and offset
      query += '?limit=' + filter.limit;
      query += '&offset=' + filter.offset;
      query += '&order=created';
      query += '&direction=desc';

      // Applying filter parts, if given.
      if (filter.filter) {
        if (filter.filter.filter && filter.filter.filter !== '') {
          query += '&request_id.like=' + encodeURIComponent('%' + filter.filter.filter + '%');
        }
        if (filter.filter.crypto_key && filter.filter.crypto_key !== -1) {
          query += '&crypto_key.eq=' + encodeURIComponent(filter.filter.crypto_key);
        }
      }
    }
  
    // Invoking backend and returning observable.
    return this.httpService.get<CryptoInvocation[]>('/magic/modules/magic/crypto_invocations' + query);
  }

  /**
   * Returns public keys from your backend.
   * 
   * @param filter Filter for which keys to return
   */
  public countInvocations(filter: any) {

    // Dynamically building our query parameters.
    let query = '';
    if (filter.filter) {
      if (filter.filter.filter && filter.filter.filter !== '') {
        query += '?request_id.like=' + encodeURIComponent('%' + filter.filter.filter + '%');
      }
      if (filter.filter.crypto_key && filter.filter.crypto_key !== -1) {
        query += '?crypto_key.eq=' + encodeURIComponent(filter.filter.crypto_key);
      }
    }

    // Invoking backend and returning observable.
    return this.httpService.get<Count>('/magic/modules/magic/crypto_invocations-count' + query);
  }
}
