import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import axios from 'axios';
import { programs } from '@metaplex/js';

const {
  metadata: { Metadata },
} = programs;

export interface INFT {
  pubkey?: PublicKey;
  mint: PublicKey;
  onchainMetadata: unknown;
  externalMetadata: unknown;
}

async function getTokensByOwner(owner: PublicKey, conn: Connection) {
  const tokens = await conn.getParsedTokenAccountsByOwner(owner, {
    programId: TOKEN_PROGRAM_ID,
  });
  let te = tokens.value;
  // initial filter - only tokens with 0 decimals & of which 1 is present in the wallet
  return tokens.value
    .filter((t) => {
      const amount = t.account.data.parsed.info.tokenAmount;
      return amount.decimals === 0 && amount.uiAmount === 1;
    })
    .map((t) => {
      return { pubkey: t.pubkey, mint: t.account.data.parsed.info.mint };
    });
}

async function getNFTMetadata(
  mint: string,
  conn: Connection,
  pubkey?: string,
  attempt: number = -1
): Promise<INFT | undefined> {
  // console.log('Pulling metadata for:', mint);
  try {
    const metadataPDA = await Metadata.getPDA(mint);
    const onchainMetadata = (await Metadata.load(conn, metadataPDA)).data;
    let externalMetadata  :any;
    //debugger;
    //if(onchainMetadata.data.symbol.toLowerCase() == "luxr" || onchainMetadata.data.symbol.toLowerCase() == "luxe" || onchainMetadata.data.symbol.toLowerCase() == "basc")
    if(onchainMetadata.data.symbol.toLowerCase() == "luxr" || onchainMetadata.data.symbol.toLowerCase() == "luxe")
    {
      externalMetadata = (await axios.get(onchainMetadata.data.uri)).data;
    }
    
    return {
      pubkey: pubkey ? new PublicKey(pubkey) : undefined,
      mint: new PublicKey(mint),
      onchainMetadata,
      externalMetadata,
    };
  } catch (e) {
    if(attempt < 5)
    {
      attempt++;
      console.log(e);
      console.log(`failed to pull metadata for token ${mint} attmept ${attempt} of 5`);
      return getNFTMetadata(mint, conn, pubkey, attempt); 
    }
    console.log(`failed to pull metadata for token ${mint} attmept ${attempt} of 5`);
  }
}

export async function getNFTMetadataForMany(
  tokens: any[],
  conn: Connection
): Promise<INFT[]> {
  const promises: Promise<INFT | undefined>[] = [];  
  tokens.forEach((t) => promises.push(getNFTMetadata(t.mint, conn, t.pubkey)));
  console.log(tokens)
  let nfts_temp : { [key: string]: any } = {};
  nfts_temp = (await Promise.all(promises)).filter((n) => !!n);
  console.log(nfts_temp)
  const nfts = nfts_temp

  let tok=[];
  for( let nft in nfts_temp)
  {
    if(nfts_temp[nft].onchainMetadata?.data?.creators?.length > 0)
    {
      let address =  nfts_temp[nft].onchainMetadata.data.creators[0]?.address || " ";
      if(address == 'B3WSDJjSrV1ikru1FCdr5bZsQ7DvEHQtCvda3yWfemsi'|| address == 'AGDBeUaKReqE3DdtWq6J9TRAarScBRhGJ77cD82wLNvD' || address == '5gx13mAde8kjx2aevhceBJtiPDNo78WppFzd9RdVN5ch' )
        tok.push(nfts_temp[nft]);
    }
  }
  // const nfts = tok
  
  console.log(`found ${nfts.length} metadatas`);

  return nfts as INFT[];
}



export async function getNFTsByOwner(
  owner: PublicKey,
  conn: Connection
): Promise<INFT[]> {
  const tokens = await getTokensByOwner(owner, conn);
  console.log(`found ${tokens.length} tokens`);

  return await getNFTMetadataForMany(tokens, conn);
}
