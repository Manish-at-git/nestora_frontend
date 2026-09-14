export interface CommitteeMemberInfo {
  id?: string;
  user_id: string;
  name: string;
  email?: string;
  profile_pic_url?: string | null;
  start_date?: string | null;
  end_date?: string | null;
}

export interface Committee {
  id: string;
  association_id: string;
  association_name?: string;
  name: string;
  description?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  member_count?: number;
  members?: CommitteeMemberInfo[];
  created_at?: string | null;
}

export interface HomeownerOption {
  account_id: string;
  user_id: string;
  name: string;
  email?: string;
  profile_pic_url?: string | null;
}

export interface AssignedMemberFormItem {
  user_id: string;
  name: string;
  email?: string;
  profile_pic_url?: string | null;
  start_date?: string;
  end_date?: string;
}

export interface CreateCommitteePayload {
  association_id: string;
  name: string;
  description?: string;
  start_date?: string | null;
  end_date?: string | null;
  members?: Array<{
    user_id: string;
    start_date?: string | null;
    end_date?: string | null;
  }>;
}

export interface UpdateCommitteePayload {
  association_id: string;
  name: string;
  description?: string;
  start_date?: string | null;
  end_date?: string | null;
  members?: Array<{
    user_id: string;
    start_date?: string | null;
    end_date?: string | null;
  }>;
}
