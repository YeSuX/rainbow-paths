import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export function SectionIntro() {
  return (
    <Alert className="bg-[#D3E5EF] border-[#56CCF2] mb-8">
      <Info className="h-5 w-5 text-[#1e5a7d]" />
      <AlertDescription className="ml-2 text-sm md:text-base text-[#37352F] space-y-3">
        <div className="font-semibold text-[#37352F] mb-2">关于本节</div>
        
        <p>
          地方组织的倡议行动促成了对同性伴侣权利与义务的多种形式的承认，这些承认通过不同的法律制度实现，名称各不相同，所赋予的权利保障程度也不一致，包括<span className="font-medium">民事结合、同居结合、事实伴侣关系、注册伴侣关系以及婚姻</span>等。
        </p>
        
        <p>
          从历史上看，对同性伴侣关系的法律承认往往早于同性婚姻的合法化。自1989年以来，越来越多的司法管辖区开始提供此类伴侣制度。多数情况下，这些制度所提供的法律保护低于婚姻，往往限制伴侣收养子女的权利。在一些国家，在同性婚姻合法化之后，这些替代性的伴侣制度被废除。
        </p>
        
        <p>
          在大多数法律体系中，婚姻仍然是对伴侣关系进行官方承认的最全面的法律形式，也是赋予最多利益、权利与义务的制度。因此，<span className="font-medium">能够在平等基础上获得这种保护，对于同性伴侣而言，意味着享有过去仅为异性恋群体所提供的稳定性与法律保障</span>。
        </p>
      </AlertDescription>
    </Alert>
  );
}

