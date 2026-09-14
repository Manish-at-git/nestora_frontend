import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "@/services/api/apiClient";
import {
  Building2,
  Plus,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardOverview } from "../DashboardOverview";

interface Association {
  id: string | number;
  name: string;
  code?: string;
  address?: string;
  city?: string;
  state?: string;
  total_units?: number;
  active_members_count?: number;
  status?: string;
  plan_tier?: string;
}

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [associations, setAssociations] = useState<Association[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeAssociation, setActiveAssociation] = useState<Association | null>(null);

  useEffect(() => {
    fetchAssociations();
  }, []);

  const fetchAssociations = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/admin/associations");
      const list = res.data?.associations || res.data || [];
      setAssociations(list);
      if (list.length > 0) {
        setActiveAssociation(list[0]);
      }
    } catch (err) {
      console.error("Failed to load admin associations", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-moss-soft text-moss text-xs font-mono font-semibold border border-moss/20">
              Admin Multi-Association Hub
            </span>
          </div>
          <h1 className="text-2xl font-bold font-display text-slate-800">
            Managed Associations & Properties
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Switch context, configure units, and oversee community operations across your portfolio.
          </p>
        </div>

        <Button
          onClick={() => navigate("/onboard")}
          className="bg-moss hover:bg-moss-dark text-white rounded-xl shadow-sm cursor-pointer"
        >
          <Plus size={16} className="mr-1.5" /> Onboard Association
        </Button>
      </div>

      {/* Association Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-56 bg-slate-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : associations.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-3xl p-8">
          <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
            <Building2 size={24} />
          </div>
          <h3 className="text-base font-semibold text-slate-700">No associations found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Get started by onboarding your first community association or society property.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {associations.map((assoc) => (
            <Card
              key={assoc.id}
              className={`border transition-all duration-200 hover:shadow-md cursor-pointer rounded-3xl overflow-hidden ${
                activeAssociation?.id === assoc.id
                  ? "border-moss bg-moss-soft/10 ring-2 ring-moss/20"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
              onClick={() => setActiveAssociation(assoc)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700 font-bold font-display text-lg">
                    {assoc.name?.[0] || "A"}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className="text-[11px] font-mono">
                      {assoc.plan_tier || "Standard"}
                    </Badge>
                    <Badge
                      variant={assoc.status === "active" ? "success" : "default"}
                      className="text-[10px]"
                    >
                      {assoc.status || "Active"}
                    </Badge>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{assoc.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                  {assoc.address ? `${assoc.address}, ${assoc.city || ""}` : "No address specified"}
                </p>

                <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Total Units</span>
                    <span className="font-bold text-slate-800 font-mono text-sm">
                      {assoc.total_units || 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Active Residents</span>
                    <span className="font-bold text-slate-800 font-mono text-sm">
                      {assoc.active_members_count || 0}
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-moss font-semibold">
                  <span>Manage Association</span>
                  <ChevronRight size={14} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Association Overview if selected */}
      {activeAssociation && (
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Active Context: {activeAssociation.name}
              </h2>
              <p className="text-xs text-slate-500">Live community timeline & operations feed</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/admin/overview")}
              className="text-xs font-medium cursor-pointer"
            >
              Open Full Overview <ExternalLink size={12} className="ml-1" />
            </Button>
          </div>
          <DashboardOverview isTenant={false} />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
