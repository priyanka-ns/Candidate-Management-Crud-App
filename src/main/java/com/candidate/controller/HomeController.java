package com.candidate.controller;

import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpSession;

import com.candidate.entity.Candidate;
import com.candidate.repository.CandidateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class HomeController {

	@Autowired
	private CandidateRepository candidateRepo;

	@GetMapping("/")
	public String home(Model m) {

		/*
		 * List<Candidate> list = candidateRepo.findAll(); m.addAttribute("all_candidate",
		 * list);
		 */

		return findPaginateAndSorting(0,"id","asc", m);
	}

	@GetMapping("/page/{pageNo}")
	public String findPaginateAndSorting(@PathVariable(value = "pageNo") int pageNo,
			@RequestParam("sortField") String sortField, @RequestParam("sortDir") String sortDir, Model m) {

		Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortField).ascending()
				: Sort.by(sortField).descending();

		Pageable pageable = PageRequest.of(pageNo, 5,sort);

		Page<Candidate> page = candidateRepo.findAll(pageable);

		List<Candidate> list = page.getContent();

		m.addAttribute("pageNo", pageNo);
		m.addAttribute("totalElements", page.getTotalElements());
		m.addAttribute("totalPage", page.getTotalPages());
		m.addAttribute("all_candidate", list);
		
		m.addAttribute("sortField",sortField);
		m.addAttribute("sortDir",sortDir);
		m.addAttribute("revSortDir",sortDir.equals("asc") ? "desc" : "asc");
		

		return "index";
	}

	@GetMapping("/load_form")
	public String loadForm() {
		return "add";
	}

	@GetMapping("/edit_form/{id}")
	public String editForm(@PathVariable(value = "id") int id, Model m) {

		Optional<Candidate> candidate = candidateRepo.findById(id);

		Candidate cand = candidate.get();
		m.addAttribute("candidate", cand);

		return "edit";
	}

	@PostMapping("/save_candidate")
	public String saveCandidate(@ModelAttribute Candidate candidate, HttpSession session) {

		candidateRepo.save(candidate);
		session.setAttribute("msg", "Candidate Added Successfully..");

		return "redirect:/";
	}

	@PostMapping("/update_candidate")
	public String updateCandidate(@ModelAttribute Candidate candidate, HttpSession session) {

		candidateRepo.save(candidate);
		session.setAttribute("msg", "Candidate Updated Successfully..");

		return "redirect:/";
	}

	@GetMapping("/delete/{id}")
	public String deleteCandidate(@PathVariable(value = "id") int id, HttpSession session) {
		candidateRepo.deleteById(id);
		session.setAttribute("msg", "Candidate Deleted Successfully..");

		return "redirect:/";

	}

}
